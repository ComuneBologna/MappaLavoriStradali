import {WGS84Coordinates} from "./WGS84Coordinates";
import * as uuid from 'uuid';
export enum GeoFeatureType {
	POINT ="POINT",
	LINE ="LINESTRING",
	CIRCLE ="CIRCLE",
	POLYGON ="POLYGON"
}

export class LabeledPoint {
	label: string;
	coordinates: WGS84Coordinates;
}
export class GeoLayer {
	public id: string = uuid.v4();
	public label: string;
	public geoFeatures: GeoFeature[];
	public canBeRemoved: boolean = true;
}
export class GeoFeatureContainer {
	public id: string = uuid.v4();
	public label: string;
	public geoLayers: GeoLayer[];
	public center: WGS84Coordinates;
	public points: LabeledPoint[] = [];
}
export class GeoFeature {
	public id: string = uuid.v4();;
	public featureType: GeoFeatureType;
	public coordinates: WGS84Coordinates[] = [];
	public radius?: number; // if fatureType is CIRCLE

	constructor(featureType?: GeoFeatureType,coordinates?: WGS84Coordinates[],radius?: number ){
		this.featureType = featureType;
		this.radius=radius;
		this.coordinates=coordinates;
	}
}