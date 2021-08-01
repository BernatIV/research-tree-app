import { Graph, Layout, Edge } from '@swimlane/ngx-graph';
import * as dagre from 'dagre';

export enum Orientation {
  LEFT_TO_RIGHT = 'LR',
  RIGHT_TO_LEFT = 'RL',
  TOP_TO_BOTTOM = 'TB',
  BOTTOM_TO_TOM = 'BT'
}
export enum Alignment {
  CENTER = 'C',
  UP_LEFT = 'UL',
  UP_RIGHT = 'UR',
  DOWN_LEFT = 'DL',
  DOWN_RIGHT = 'DR'
}

export interface DagreSettings {
  orientation?: Orientation;
  marginX?: number;
  marginY?: number;
  edgePadding?: number;
  rankPadding?: number;
  nodePadding?: number;
  align?: Alignment;
  acyclicer?: 'greedy' | undefined;
  ranker?: 'network-simplex' | 'tight-tree' | 'longest-path';
  multigraph?: boolean;
  compound?: boolean;
}

export interface DagreNodesOnlySettings extends DagreSettings {
  curveDistance?: number;
}

const DEFAULT_EDGE_NAME = '\x00';
const GRAPH_NODE = '\x00';
const EDGE_KEY_DELIM = '\x01';

export class DagreNodesOnlyLayout implements Layout {
  defaultSettings: DagreNodesOnlySettings = {
    orientation: Orientation.LEFT_TO_RIGHT,
    marginX: 20,
    marginY: 20,
    edgePadding: 100,
    rankPadding: 100,
    nodePadding: 50,
    curveDistance: 20,
    multigraph: false, // si es true les línies de relacions no poden estar superposades
    compound: true
  };
  settings: DagreNodesOnlySettings = {};

  dagreGraph: any;
  dagreNodes: any;
  dagreEdges: any;

  public run(graph: Graph): Graph {
    // modificar posició de node couple?

    let couples = new Map();

    graph.edges.forEach(edge => {
      if (edge.data.isCoupleRelation) {
        console.log('hash: ' + edge.source + ' and ' + edge.target);

        if (couples.get(edge.target) !== edge.source) {
          couples.set(edge.source, edge.target);
        }

        // then we want to keep this id and change the X position of this ID
      }
    });

    console.log('couples map ---> ', couples);

    // iterem el map
    couples.forEach((value, key, map) => {
      console.log('key and value: ' + key + ' ' + value);

      const node = graph.nodes.find(node => node.id === value);
      const nodeOrigin = graph.nodes.find(node => node.id === key);
      node.position.x = nodeOrigin.position.x;

      // graph.nodes.forEach(node => {
      //   if (node.id === value) {
      //     node.position.x = nodeOrigin.position.x;
      //   }
      // });
    });



    // ----------------

    this.createDagreGraph(graph);
    dagre.layout(this.dagreGraph);

    graph.edgeLabels = this.dagreGraph._edgeLabels;

    for (const dagreNodeId in this.dagreGraph._nodes) {
      const dagreNode = this.dagreGraph._nodes[dagreNodeId];
      const node = graph.nodes.find(n => n.id === dagreNode.id);

      //--- Canvi posició X
      let posX = dagreNode.x; // Les x son les y i al revés, perq el layout està vertical
      if (dagreNode.id === '7') {
        const nodeOrigin = graph.nodes.find(n => n.id === '1');
        const couplePos = nodeOrigin.position.x;
        posX = couplePos - 250;
      }

      //--- Canvi posició Y
      let posY = dagreNode.y;
      if (dagreNode.id === '7') {
        const nodeOrigin = graph.nodes.find(n => n.id === '1');
        const couplePos = nodeOrigin.position.y;
        posY = couplePos;
      }

      // ----- Fi canvi

      // Notes: lo ideal, realment, seria tenir més d'un graph. S'ha de poder fer.
      // Un graph per la família de la Iaia Pilar, un altre per la família del Josep.
      // Amb una fletxa a part, connectar la Pilar i el Josep, però també que quan cliquis un germà de la pilar
      // s'esborri la família del josep i aparegui la família de la parella d'aquesta germana.

      node.position = {
        x: posX, //dagreNode.x,
        y: posY // dagreNode.y
      };
      node.dimension = {
        width: dagreNode.width,
        height: dagreNode.height
      };
    }
    for (const edge of graph.edges) {
      this.updateEdge(graph, edge);
    }

    return graph;
  }

  public updateEdge(graph: Graph, edge: Edge): Graph {
    console.log('Hola estic passant per updateEdge');

    const sourceNode = graph.nodes.find(n => n.id === edge.source);
    const targetNode = graph.nodes.find(n => n.id === edge.target);

    let ra: 'x' | 'y' = this.settings.orientation === 'BT' || this.settings.orientation === 'TB' ? 'y' : 'x';
    if (edge.data.isCoupleRelation) { // TODO: també s'ha de desactivar que un es situï per sobre de l'altre en una relació
      if (ra === 'y') {
        ra = 'x';
      } else {
        ra = 'y';
      }
      // targetNode.position.y = sourceNode.position.y - 60;
    }
    const rankAxis: 'x' | 'y' = ra;
    const orderAxis: 'x' | 'y' = rankAxis === 'y' ? 'x' : 'y';
    const rankDimension = rankAxis === 'y' ? 'height' : 'width';
    // determine new arrow position
    const dir = sourceNode.position[rankAxis] <= targetNode.position[rankAxis] ? -1 : 1;
    const startingPoint = {
      [orderAxis]: sourceNode.position[orderAxis],
      [rankAxis]: sourceNode.position[rankAxis] - dir * (sourceNode.dimension[rankDimension] / 2)
    };
    const endingPoint = {
      [orderAxis]: targetNode.position[orderAxis],
      [rankAxis]: targetNode.position[rankAxis] + dir * (targetNode.dimension[rankDimension] / 2)
    };

    const curveDistance = this.settings.curveDistance || this.defaultSettings.curveDistance;
    // generate new points
    edge.points = [
      startingPoint,
      {
        [rankAxis]: (startingPoint[rankAxis] + endingPoint[rankAxis]) / 2,
        [orderAxis]: startingPoint[orderAxis]
      },
      {
        [orderAxis]: endingPoint[orderAxis],
        [rankAxis]: (startingPoint[rankAxis] + endingPoint[rankAxis]) / 2
      },
      endingPoint
    ];
    const edgeLabelId = `${edge.source}${EDGE_KEY_DELIM}${edge.target}${EDGE_KEY_DELIM}${DEFAULT_EDGE_NAME}`;
    const matchingEdgeLabel = graph.edgeLabels[edgeLabelId];
    if (matchingEdgeLabel) {
      matchingEdgeLabel.points = edge.points;
    }
    return graph;
  }

  public createDagreGraph(graph: Graph): any {
    console.log('Hola estic passant per createDagreGraph');

    const settings = Object.assign({}, this.defaultSettings, this.settings);
    this.dagreGraph = new dagre.graphlib.Graph({ compound: settings.compound, multigraph: settings.multigraph });
    this.dagreGraph.setGraph({
      rankdir: settings.orientation,
      marginx: settings.marginX,
      marginy: settings.marginY,
      edgesep: settings.edgePadding,
      ranksep: settings.rankPadding,
      nodesep: settings.nodePadding,
      align: settings.align,
      acyclicer: settings.acyclicer,
      ranker: settings.ranker,
      multigraph: settings.multigraph,
      compound: settings.compound
    });

    // Default to assigning a new object as a label for each new edge.
    this.dagreGraph.setDefaultEdgeLabel(() => {
      return {
        /* empty */
      };
    });

    this.dagreNodes = graph.nodes.map(n => {
      const node: any = Object.assign({}, n);
      node.width = n.dimension.width;
      node.height = n.dimension.height;
      node.x = n.position.x;
      node.y = n.position.y;
      return node;
    });

    this.dagreEdges = graph.edges.map(l => {
      let linkId: number = 1;
      const newLink: any = Object.assign({}, l);
      if (!newLink.id) {
        newLink.id = linkId;
        linkId++;
      }
      return newLink;
    });
    console.log('Print dagreeEdges: ', ...this.dagreEdges);

    for (const node of this.dagreNodes) {
      if (!node.width) {
        node.width = 20;
      }
      if (!node.height) {
        node.height = 30;
      }

      // if (node.id === '7') { // és un dels ids amb couple relation (construiré un array amb tots els targets couple relation)
      //   // node.x = node.x - 1000;
      //   node.position.x = node.position.x - 1000;
      //   console.log('hola bon dia?');
      // }

      // update dagre
      this.dagreGraph.setNode(node.id, node);
    }

    // update dagre
    for (const edge of this.dagreEdges) {
      if (settings.multigraph) {
        this.dagreGraph.setEdge(edge.source, edge.target, edge, edge.id);
      } else {
        this.dagreGraph.setEdge(edge.source, edge.target);
      }
    }

    return this.dagreGraph;
  }
}
