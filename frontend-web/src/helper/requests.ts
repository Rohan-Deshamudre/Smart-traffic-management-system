import axios from 'axios'

const SERVER_ADDRESS = "https://api.mapbox.com/directions/v5/mapbox/driving/";

/*
	Get the directions from the MapBox API
 */
function getRoute(roadSegment, overview) {
	return new Promise((resolve) => {
		let string = '';
		for(let i = 0; i < roadSegment.length; i++) {
			if(i === roadSegment.length - 1) {
				string = string + roadSegment[i][0] + ',' + roadSegment[i][1];
			} else {
				string = string + roadSegment[i][0] + ',' + roadSegment[i][1] + ';';
			}
		}
		resolve(axios.get(SERVER_ADDRESS + string + '?overview=' + overview + '&alternatives=true' + '&geometries=geojson&access_token=' + process.env.MAPBOX_TOKEN));
	});

}


function getAlternateRoute(coords) {
	return new Promise((resolve) => {
		let string = '';
		for(let i = 0; i < coords.length; i++) {
			if(i === coords.length - 1) {
				string += coords[i][0] + ',' + coords[i][1];
			} else {
				string += coords[i][0] + ',' + coords[i][1] + ';';
			}
		}
		resolve(axios.get(SERVER_ADDRESS + string + '?alternatives=true' + '&geometries=geojson&access_token=' + process.env.MAPBOX_TOKEN))
	})
}


export const requests = {
	getRoute: getRoute,
	getAlternateRoute: getAlternateRoute,
	host: SERVER_ADDRESS
};