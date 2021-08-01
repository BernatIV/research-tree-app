import {INode} from "./inode.model";

export interface MarriedModel extends INode {
    firstRelation: string;
    secondRelation: string;
}
