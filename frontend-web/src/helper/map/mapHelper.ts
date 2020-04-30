import {requests} from "../requests";

/*
	Change the Instrument location, and location type
	Return a GEOJSON feature, with the bearing of the point
	as well as the new coordinates.
 */
function instrumentPointToLine(instruments: { id: number, name: string, lat: number, lng: number, instrumentActions: any }[]) {
	return instruments.map(async function (instrument: any) {

		const instrumentToLine = [[instrument.lng, instrument.lat],[instrument.lng + 0.0001, instrument.lat + 0.00003]];
		let newBearing = undefined;
		let coordinates = undefined;
		await requests.getRoute(instrumentToLine, 'simplified').then((result: any) =>  {
			coordinates = result.data.routes[0].geometry.coordinates;
			newBearing = bearing(coordinates[0][1], coordinates[0][0], coordinates[1][1], coordinates[1][0]);
		});

		return {
			"type": 'Feature',
			"properties": {
				name: instrument.name,
				id: instrument.id,
				bearing: newBearing
			},
			'geometry': {
				'type': 'Point',
				'coordinates': coordinates[0]
			}
		};
	});

}

// Converts from degrees to radians.
function toRadians(degrees) {
	return degrees * Math.PI / 180;
}

// Converts from radians to degrees.
function toDegrees(radians) {
	return radians * 180 / Math.PI;
}

// Calculate bearing between two locations
function bearing(startLat, startLng, destLat, destLng){
	startLat = toRadians(startLat);
	startLng = toRadians(startLng);
	destLat = toRadians(destLat);
	destLng = toRadians(destLng);

	const y = Math.sin(destLng - startLng) * Math.cos(destLat);
	const x = Math.cos(startLat) * Math.sin(destLat) -
		Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng);
	let brng = Math.atan2(y, x);
	brng = toDegrees(brng);
	return (brng + 360) % 360;
}

/*
	Check whether the boundingbox of the coordinates has overlap with the boundingBox of the map
	For each side of the box of the map, check if the coordinates boundingbox is further than that.
	First comparison: check if the coordinates are all to the right of the map
	Second: check if the coordinates are all below the map
	Third: check if the coordinates are all to the left of the map
	Fourth: check if the coordinates are all above the map
	Return true if the coordinates have overlap with the map
 */
function isWithinBoundingBox(coordinates: [[number, number], [number, number]], mapCoords: [[number, number], [number, number]]) {
	return !(coordinates[1][0] > mapCoords[1][0] || coordinates[0][1] < mapCoords[1][1] || coordinates[1][0] < mapCoords[0][0] || coordinates[1][1] > mapCoords[0][1])
}

function instrumentWithinBoundingBox(coordinates: [number, number], mapCoords: [[number, number], [number, number]]) {
	return coordinates[0] > mapCoords[0][0] && coordinates[0] < mapCoords[1][0] && coordinates[1] > mapCoords[1][1] && coordinates[1] < mapCoords[0][1]
}

export const mapHelper = {
	instrumentPointToLine: instrumentPointToLine,
	isWithinBoundingBox: isWithinBoundingBox,
	instrumentWithinBoundingBox: instrumentWithinBoundingBox
};