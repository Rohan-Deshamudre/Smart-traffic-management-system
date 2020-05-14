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

// function displayRoutes(routes: any, sourceId: string, map: mb.Map) {
// 	if (routes !== undefined) {
//
// 		Promise.all(routes).then((result: any) => {
// 			const geoJson: any = result.map((route) => {
// 				return {
// 					'type': 'Feature',
// 					'properties': {
// 						'description': '<strong>Text over here!</strong>',
// 						'icon': route.data.routes[0].properties.icon
// 					},
// 					'geometry': {
// 						'type': 'LineString',
// 						'coordinates': route.data.routes[0].geometry.coordinates
// 					}
// 				}
// 			});
//
// 			map.on("idle", function () {
// 				(map.getSource(sourceId) as GeoJSONSource).setData({
// 					"type": 'FeatureCollection',
// 					"features": geoJson
// 				});
//
// 				// Add a layer showing the places.
// 				map.addLayer({
// 					'id': 'places',
// 					'type': 'symbol',
// 					'source': 'places',
// 					'layout': {
// 						'icon-image': '{icon}-15',
// 						'icon-allow-overlap': true
// 					}
// 				});
//
// 				// Create a popup, but don't add it to the map yet.
// 				var popup = new mapboxgl.Popup({
// 					closeButton: false,
// 					closeOnClick: false
// 				});
//
// 				map.on('mouseenter', 'places', function(e) {
// 					// Change the cursor style as a UI indicator.
// 					map.getCanvas().style.cursor = 'pointer';
//
// 					var coordinates = e.features[0].geometry.coordinates.slice();
// 					var description = e.features[0].properties.description;
//
// 					// Ensure that if the map is zoomed out such that multiple
// 					// copies of the feature are visible, the popup appears
// 					// over the copy being pointed to.
// 					while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
// 						coordinates[0] += (e.lngLat.lng > coordinates[0]) ? 360 : -360;
// 				}
//
// 				// Populate the popup and set its coordinates
// 				// based on the feature found.
// 				popup
// 					.setLngLat(coordinates)
// 					.setHTML(description)
// 					.addTo(map);
// 				});
//
// 				map.on('mouseleave', 'places', function() {
// 					map.getCanvas().style.cursor = '';
// 					popup.remove();
// 				});
// 			});
// 		});
//
// 	} else {
// 		map.on("idle", function () {
// 			(map.getSource(sourceId) as GeoJSONSource).setData(null);
// 		});
// 	}
// }

// function displayIcons(routes: any, sourceId: any, map: mb.Map) {
// 	if (routes != undefined) {
// 		Promise.all(routes).then((result: any) => {
//
// 			const geoJson: any = result.map((route) => {
// 				return {
// 					'type': 'Feature',
// 					'properties': {
// 						'description':
// 							'<strong>Text over here!</strong>',
// 						'icon': route.data.routes[0].properties.icon
// 					},
// 					'geometry': {
// 						'type': 'LineString',
// 						'coordinates': route.data.routes[0].geometry.coordinates
// 					}
// 				}
// 			});
// 			map.on("idle", function () {
// 				(map.getSource(sourceId) as GeoJSONSource).setData({
// 					"type": 'FeatureCollection',
// 					"features": geoJson
// 				});
// 			});
// 		});
// 	} else {
// 		map.on("idle", function () {
// 			(map.getSource(sourceId) as GeoJSONSource).setData(null);
// 		});
// 	}
// }

export const mapDisplay = {
	displayInstruments: displayInstruments,
	displayLargeInstruments: displayLargeInstruments,
	displayOneMarker: displayOneMarker,
	displayRoutes: displayRoutes,
	// displayIcons: displayIcons
};
