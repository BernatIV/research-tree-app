import {Component, Input, OnInit} from '@angular/core';
import {Edge, Node, Layout, DagreNodesOnlyLayout} from "@swimlane/ngx-graph";
import * as shape from 'd3-shape';

/**
 * Millor llibreria del món:
 * https://swimlane.github.io/ngx-graph/
 */

export class Employee {
  id: string;
  name: string;
  office: string;
  role: string;
  backgroundColor: string;
  upperManagerId?: string;
}

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements OnInit {

  @Input() employees: Employee[] = [];

  public nodes: Node[] = [];
  public links: Edge[] = [];
  public layoutSettings = {
    orientation: 'TB'
  };
  public curve: any = shape.curveLinear;
  public layout: Layout = new DagreNodesOnlyLayout();

  constructor() {
    this.employees = [
      {
        id: '1',
        name: 'Pilar Casanovas Casals',
        office: 'Olesa de Montserrat',
        role: 'Olesa de Montserrat',
        backgroundColor: '#68AC85',
        upperManagerId: '3'
      },
      {
        id: '2',
        name: 'Manel Casanovas Casals',
        office: 'Olesa de Montserrat',
        role: 'Olesa de Montserrat',
        backgroundColor: '#68AC85',
        upperManagerId: '3'
      },
      {
        id: '3',
        name: 'Carme Casals Palet',
        office: 'BCN 4-2-1904',
        role: 'BCN 1986',
        backgroundColor: '#68AC85',
      },
      {
        id: '4',
        name: 'Jordi Mañé Casanovas',
        office: 'BCN 28-04-1954',
        role: '',
        backgroundColor: '#68AC85',
        upperManagerId: '1'
      },
      {
        id: '5',
        name: 'Montserrat Mañé Casanovas',
        office: 'BCN 28-03-1963',
        role: '',
        backgroundColor: '#68AC85',
        upperManagerId: '1'
      },
      {
        id: '6',
        name: 'Anna Mañé Casanovas',
        office: 'BCN 03-09-1969',
        role: '',
        backgroundColor: '#68AC85',
        upperManagerId: '1'
      }
    ];
  }

  public ngOnInit(): void {
    for (const employee of this.employees) {
      const node: Node = {
        id: employee.id,
        label: employee.name,
        data: {
          office: employee.office,
          role: employee.role,
          backgroundColor: employee.backgroundColor
        }
      };

      this.nodes.push(node);
    }

    for (const employee of this.employees) {
      if (!employee.upperManagerId) {
        continue;
      }

      const edge: Edge = {
        source: employee.upperManagerId,
        target: employee.id,
        label: '',
        data: {
          linkText: 'Mare de'
        }
      };

      this.links.push(edge);
    }
  }

  public getStyles(node: Node): any {
    return {
      'background-color': node.data.backgroundColor
    };
  }
}
