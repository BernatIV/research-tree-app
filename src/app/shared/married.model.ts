import {INode} from "./inode.model";

export class MarriedModel implements INode {
    id: string
    firstRelation: string;
    secondRelation: string;
}
