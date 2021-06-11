export class WGS84Coordinates {
	public latitude: number;
	public longitude: number;
	public altitude?: number;

	constructor(longitude: number,latitude: number,altitude?: number){
		this.latitude=latitude;
		this.longitude=longitude;
        this.altitude=altitude;
	}
}