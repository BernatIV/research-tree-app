import {Component, Input, OnInit} from '@angular/core';
import {
    Edge,
    Node,
    Layout, DagreLayout
} from "@swimlane/ngx-graph";
import * as shape from 'd3-shape';
import {PersonModel} from "../shared/person.model";
import {DagreNodesOnlyLayout} from "./customDagreNodesOnly";

/**
 * Millor llibreria del món:
 * https://swimlane.github.io/ngx-graph/
 */

export class FamilyNode {
    id: string;
    name: string;
    firstSurname: string;
    secondSurname: string;
    llocNaixement: string;
    llocMort?: string;
    role: string;
    backgroundColor: string;
    parentNode?: string;
}

@Component({
    selector: 'app-graph',
    templateUrl: './graph.component.html',
    styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements OnInit {

    @Input() employees: FamilyNode[] = [];
    @Input() familyMembers: PersonModel[] = [];

    public readonly NODE_COLOR:string = '#B6C6A0';

    public nodes: Node[] = [];
    public links: Edge[] = [];
    public layoutSettings = {
        orientation: 'TB'       // Posa 'BT' si vols que l'arbre vagi de baix a dalt
    };
    // public curve: any = shape.curveLinear;
    public layout: Layout = new DagreNodesOnlyLayout();
    // public layout: Layout = new DagreLayout();

    constructor() {
        this.familyMembers = [
            {
                id: '1',
                name: 'Pilar',
                firstSurname: 'Casanovas',
                secondSurname: 'Casals',
                llocNaixement: 'Olesa de Montserrat',
                role: '',
                backgroundColor: this.NODE_COLOR,
                parentNode: '3',
                currentCouple: '7'
            },
            {
                id: '7',
                name: 'Josep',
                firstSurname: 'Mañé',
                secondSurname: 'Orriols',
                llocNaixement: 'BCN 29-03-1924',
                llocDefuncio: 'BCN 21-08-1985',
                role: '',
                backgroundColor: this.NODE_COLOR,
                currentCouple: '1'
            },
            {
                id: '2',
                name: 'Manel',
                firstSurname: 'Casanovas',
                secondSurname: 'Casals',
                llocNaixement: 'Olesa de Montserrat',
                llocDefuncio: 'Barcelona',
                role: 'Sacerdot',
                backgroundColor: this.NODE_COLOR,
                parentNode: '3'
            },
            {
                id: '3',
                name: 'Carme',
                firstSurname: 'Casals',
                secondSurname: 'Palet',
                llocNaixement: 'BCN 4-2-1904',
                llocDefuncio: 'BCN 1986',
                role: '',
                backgroundColor: this.NODE_COLOR,
            },
            {
                id: '4',
                name: 'Jordi',
                firstSurname: 'Mañé',
                secondSurname: 'Casanovas',
                llocNaixement: 'BCN 28-04-1954',
                role: '',
                backgroundColor: this.NODE_COLOR,
                parentNode: '1'
            },
            {
                id: '5',
                name: 'Montserrat',
                firstSurname: 'Mañé',
                secondSurname: 'Casanovas',
                llocNaixement: 'BCN 28-03-1963',
                role: '',
                backgroundColor: this.NODE_COLOR,
                parentNode: '1'
            },
            {
                id: '6',
                name: 'Anna',
                firstSurname: 'Mañé',
                secondSurname: 'Casanovas',
                llocNaixement: 'BCN 03-09-1969',
                role: '',
                backgroundColor: this.NODE_COLOR,
                parentNode: '1'
            }
        ];

        this.employees = [
            {
                id: '1',
                name: 'Pilar',
                firstSurname: 'Casanovas',
                secondSurname: 'Casals',
                llocNaixement: 'Olesa de Montserrat',
                role: '',
                backgroundColor: this.NODE_COLOR,
                parentNode: '3'
            },
            {
                id: '2',
                name: 'Manel',
                firstSurname: 'Casanovas',
                secondSurname: 'Casals',
                llocNaixement: 'Olesa de Montserrat',
                llocMort: 'Barcelona',
                role: 'Sacerdot',
                backgroundColor: this.NODE_COLOR,
                parentNode: '3'
            },
            {
                id: '3',
                name: 'Carme',
                firstSurname: 'Casals',
                secondSurname: 'Palet',
                llocNaixement: 'BCN 4-2-1904',
                llocMort: 'BCN 1986',
                role: '',
                backgroundColor: this.NODE_COLOR,
            },
            {
                id: '4',
                name: 'Jordi',
                firstSurname: 'Mañé',
                secondSurname: 'Casanovas',
                llocNaixement: 'BCN 28-04-1954',
                role: '',
                backgroundColor: this.NODE_COLOR,
                parentNode: '1'
            },
            {
                id: '5',
                name: 'Montserrat',
                firstSurname: 'Mañé',
                secondSurname: 'Casanovas',
                llocNaixement: 'BCN 28-03-1963',
                role: '',
                backgroundColor: this.NODE_COLOR,
                parentNode: '1'
            },
            {
                id: '6',
                name: 'Anna',
                firstSurname: 'Mañé',
                secondSurname: 'Casanovas',
                llocNaixement: 'BCN 03-09-1969',
                role: '',
                backgroundColor: this.NODE_COLOR,
                parentNode: '1'
            }
        ];
    }

    public ngOnInit(): void {
        for (const member of this.familyMembers) {
            const node: Node = {
                id: member.id,
                label: member.name,
                data: {
                    firstSurname: member.firstSurname,
                    secondSurname: member.secondSurname,
                    llocNaixement: member.llocNaixement,
                    role: member.role,
                    backgroundColor: member.backgroundColor
                }
            };

            this.nodes.push(node);
        }

        for (const member of this.familyMembers) {
            if (!member.parentNode) {
                continue;
            }

            const edge: Edge = {
                source: member.parentNode,
                target: member.id,
                label: '',
                data: {
                    linkText: ''
                }
            };

            this.links.push(edge);
        }

        this.buildCoupleRelation();
    }

    public getStyles(node: Node): any {
        return {
            'background-color': node.data.backgroundColor
        };
    }

    /**
     * PRIVATE METHODS
     */

    private buildCoupleRelation() {
        for (const member of this.familyMembers) {
            if (!member.currentCouple) {
                continue;
            }

            const edge: Edge = {
                source: member.id,
                target: member.currentCouple,
                label: '',
                data: {
                    isCoupleRelation: true,
                    linkText: ''
                }
            };
            this.links.push(edge);
        }
    }
}
