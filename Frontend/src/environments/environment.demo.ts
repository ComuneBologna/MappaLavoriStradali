// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
	production: false,
	hmr       : false,
	security : {
		"issuer": "https://login-demo.asfweb.it/d5f3767e-5367-42be-b6cb-fe7b01d3e387"
	},
	apiStreetUrl: "https://api-demo.smartpa.cloud/placename/v1/PlaceName/map/addresses",
	apiUrl:"https://roadworksapi-demo.azurewebsites.net/v1",
	authorityId: 7,
	userUrl: "https://api-demo.smartpa.cloud/core/v1/backofficesecurity/getuserpermissions",
	placeNameUrl:"https://api-demo.smartpa.cloud/placeName/v1"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
