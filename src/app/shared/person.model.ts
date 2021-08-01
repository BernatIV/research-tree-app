import {INode} from "./inode.model";

export interface PersonModel extends INode {
    name: string;
    firstSurname: string;
    secondSurname: string;
    llocNaixement: string;
    llocDefuncio?: string;
    role: string;
    backgroundColor: string;
    parentNode?: string;
    currentCouple?: string
}
