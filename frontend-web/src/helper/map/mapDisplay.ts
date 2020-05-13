import * as mb from 'mapbox-gl';
import {mapHelper} from "./mapHelper";
import {GeoJSONSource} from "mapbox-gl";

/*
	Change the data of the drips source
 */
function displayInstruments(map: mb.Map, instruments: any) {
	map.on("load", function () {
		Promise.all(mapHelper.instrumentPointToLine(instruments)).then((results: any) => {
			(map.getSource('drips') as GeoJSONSource).setData({
				"type": 'FeatureCollection',
				"features": results
			});
		});
	});
}


function displayLargeInstruments(map: mb.Map, visibleInstruments: [string, [number, number]][]) {
	if (visibleInstruments.length === 0) {
		map.setLayoutProperty('largeInstrumentsLayer', 'visibility', 'none');
		(map.getSource('largeInstrumentsSource') as GeoJSONSource).setData(null);
	} else {

		let visibleInstrumentsData: any =
		{
			"type": 'FeatureCollection',
			"features": visibleInstruments.map((instrument) => {
				return {
					"type": "Feature",
					"geometry": {
						"type": "Point",
						"coordinates": instrument[1]
					},
					"properties": {
						"text": instrument[0]
					}
				}
			})
		};

		map.setLayoutProperty('largeInstrumentsLayer', 'visibility', 'visible');
		(map.getSource('largeInstrumentsSource') as GeoJSONSource).setData(visibleInstrumentsData);

	}
}

/*
	Edit the MapBox GL Directions Plug-in to display 1 point on the map
 */
function displayOneMarker(directions: any, client: any) {
	directions.on('destination', () => {
		if (directions.getDestination().geometry !== undefined) {
			const newOrigin = directions.getDestination().geometry.coordinates;
			directions.removeRoutes();
			directions.setOrigin(newOrigin);
			client.writeData({
				data: {
					longitude: directions.getOrigin().geometry.coordinates[0],
					latitude: directions.getOrigin().geometry.coordinates[1]
				}
			});
		}
	});
}

function displayRoutes(routes: any, sourceId: string, map: mb.Map) {
	if (routes !== undefined) {

		Promise.all(routes).then((result: any) => {

			const geoJson: any = result.map((route) => {
				return {
					'type': 'Feature',
					'properties': {},
					'geometry': {
						'type': 'LineString',
						'coordinates': route.data.routes[0].geometry.coordinates
					}
				}
			});
			map.on("idle", function () {
				(map.getSource(sourceId) as GeoJSONSource).setData({
					"type": 'FeatureCollection',
					"features": geoJson
				});
			});
		});
	} else {
		map.on("idle", function () {
			(map.getSource(sourceId) as GeoJSONSource).setData(null);
		});
	}
}

export const mapDisplay = {
	displayInstruments: displayInstruments,
	displayLargeInstruments: displayLargeInstruments,
	displayOneMarker: displayOneMarker,
	displayRoutes: displayRoutes
};