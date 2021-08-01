import {Component, Input, OnInit} from '@angular/core';
import {
    Edge,
    Node,
    Layout, DagreLayout, DagreClusterLayout
} from "@swimlane/ngx-graph";
import * as shape from 'd3-shape';
import {PersonModel} from "../shared/person.model";
import {DagreNodesOnlyLayout} from "./customDagreNodesOnly";
import {FamilyMembersService} from "../services/familyMembers.service";

/**
 * Millor llibreria del món:
 * https://swimlane.github.io/ngx-graph/
 */

@Component({
    selector: 'app-graph',
    templateUrl: './graph.component.html',
    styleUrls: ['./graph.component.scss'],
    providers: [FamilyMembersService]
})
export class GraphComponent implements OnInit {

    // @Input() employees: FamilyNode[] = [];
    @Input() familyMembers: PersonModel[] = [];

    public nodes: Node[] = [];
    public links: Edge[] = [];
    public layoutSettings = {
        orientation: 'TB'       // Posa 'BT' si vols que l'arbre vagi de baix a dalt
    };
    // public curve: any = shape.curveLinear;
    public layout: Layout = new DagreNodesOnlyLayout();
    // public layout: Layout = new DagreClusterLayout();
    // public layout: Layout = new DagreLayout();

    constructor(private familyMembersService: FamilyMembersService) {}

    public ngOnInit(): void {
        this.familyMembers = this.familyMembersService.familyMembers;

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
        console.log('building couple relations');
        for (const member of this.familyMembers) {
            if (!member.currentCouple) {
                continue;
            }

            // TODO: crear un node entremig d'on pengin els fills?

            const edge: Edge = {
                source: member.id,
                target: member.currentCouple,
                label: '',
                data: {
                    isCoupleRelation: true,
                    linkText: 'Montserrat'
                }
            };
            this.links.push(edge);
        }
    }
}
