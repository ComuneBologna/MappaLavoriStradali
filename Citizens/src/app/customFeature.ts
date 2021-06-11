export class CustomFeature{
    name: string;
    ID: number;
    coordinates: Array<Array<number>>;

    constructor(name: string, ID: number, coordinates: Array<Array<number>>){
        this.name=name;
        this.ID=ID;
        this.coordinates=coordinates;
    }
}