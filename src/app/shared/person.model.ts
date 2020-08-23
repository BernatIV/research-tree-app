import {INode} from "./inode.model";

export class PersonModel implements INode {
    id: string;
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
