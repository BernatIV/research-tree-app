import {PersonModel} from "../shared/person.model";

export class FamilyMembersService {

    private readonly NODE_COLOR:string = '#B6C6A0';

    familyMembers: PersonModel[] = [
        {
            id: '1',
            name: 'Pilar',
            firstSurname: 'Casanovas',
            secondSurname: 'Casals',
            llocNaixement: 'Olesa de Montserrat',
            role: 'Música',
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
            role: 'Enginyer de so',
            backgroundColor: this.NODE_COLOR,
            parentNode: '8',
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
        },
        {
            id: '8',
            name: 'Maria',
            firstSurname: 'Orriols',
            secondSurname: 'Fontanilles',
            llocNaixement: 'BCN 1893',
            role: '',
            backgroundColor: this.NODE_COLOR
        }
    ];
}
