import * as mb from 'mapbox-gl';
import { mapHelper } from "./mapHelper";
import { GeoJSONSource } from "mapbox-gl";

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

function display(routes: any, sourceId: string, map: mb.Map) {
    displayRoutes(routes, sourceId, map);
    displayConditionIcon(routes, sourceId, map);
    displayDestination(routes, sourceId, map);
    displayAlternate(routes, sourceId, map);
}

function displayRoutes(routes: any, sourceId: string, map: mb.Map) {
    if (routes !== undefined) {
        Promise.all(routes).then((result: any) => {
            const geoJson: any = result.map((route) => {
                console.log(route.data.routes);

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


function displayConditionIcon(routes: any, sourceId: string, map: mb.Map) {
    if (routes != undefined) {
        Promise.all(routes).then((result: any) => {
            const geoJson: any = result.map((route) => {
                var mid_pt = Math.ceil(route.data.routes[0].geometry.coordinates.length / 2);
                var loc = route.data.routes[0].geometry.coordinates[mid_pt];

                return {
                    'type': 'Feature',
                    'properties': {
                        'description':
                            '<strong>Congestion</strong>' +
                            '<p>This road has congestion!</p>',
                        'icon': 'car'
                    },
                    'geometry': {
                        'type': 'Point',
                        'coordinates': loc
                    }
                }
            });

            map.on("idle", function () {
                (map.getSource(sourceId) as GeoJSONSource).setData({
                    "type": 'FeatureCollection',
                    "features": geoJson
                });

                var name = sourceId.slice(0, sourceId.length - 6);
                var mapLayer = map.getLayer(name + 'popup');
                if (typeof mapLayer !== 'undefined') {
                    map.removeLayer(name + 'popup');
                }

                // Add a layer showing the popup.
                map.addLayer({
                    'id': name + 'popup',
                    'type': 'symbol',
                    'source': sourceId,
                    'layout': {
                        'icon-image': '{icon}-15',
                        'icon-allow-overlap': true
                    }
                });

                var popup = new mb.Popup({
                    closeButton: false,
                    closeOnClick: false
                });

                map.on('mouseenter', name + 'popup', function (e) {
                    // Change the cursor style as a UI indicator.
                    map.getCanvas().style.cursor = 'pointer';

                    var description = e.features[0].properties.description;

                    geoJson.map(function (pop) {
                        popup
                            .setLngLat(pop.geometry.coordinates)
                            .setHTML(description)
                            .addTo(map);
                    })
                });

                map.on('mouseleave', name + 'popup', function () {
                    map.getCanvas().style.cursor = '';
                    popup.remove();
                });
            });
        });
    } else {
        map.on("idle", function () {
            (map.getSource(sourceId) as GeoJSONSource).setData(null);
        });
    }
}

function displayDestination(routes: any, sourceId: string, map: mb.Map) {
    if (routes != undefined) {
        Promise.all(routes).then((result: any) => {
            const geoJson: any = result.map((route) => {
                //console.log(route.data.routes)
                var end_pt = route.data.routes[0].geometry.coordinates.length - 1;
                var loc = route.data.routes[0].geometry.coordinates[end_pt];

                var mid_pt = Math.ceil(route.data.routes[0].geometry.coordinates.length / 2);
                var loc_mid = route.data.routes[0].geometry.coordinates[mid_pt];

                return {
                    'type': 'Feature',
                    'properties': {},
                    'geometry': {
                        'type': 'Point',
                        'coordinates': loc
                    }
                }
            });

            map.on("idle", function () {
                geoJson.map(function (marker) {
                    new mb.Marker()
                        .setLngLat(marker.geometry.coordinates)
                        .addTo(map);
                });

                (map.getSource(sourceId) as GeoJSONSource).setData({
                    "type": 'FeatureCollection',
                    "features": geoJson
                });

                /*
                var name = sourceId.slice(0, sourceId.length - 6);
                var mapLayer = map.getLayer(name + 'popup');
                if (typeof mapLayer !== 'undefined') {
                        map.removeLayer(name + 'popup');
                }

                // Add a layer showing the popup.
                map.addLayer({
                        'id': name + 'popup',
                        'type': 'symbol',
                        'source': sourceId,
                        'layout': {
                                'icon-image': '{icon}-15',
                                'icon-allow-overlap': true
                        }
                });

                var popup = new mb.Popup({
                        closeButton: false,
                        closeOnClick: false
                });
	
                map.on('mouseenter', name + 'popup', function(e) {
                        // Change the cursor style as a UI indicator.
                        map.getCanvas().style.cursor = 'pointer';
	
                        var description = e.features[0].properties.description;

                        geoJson.map(function(pop) {
                                popup
                                        .setLngLat(pop.geometry.coordinates)
                                        .setHTML(description)
                                        .addTo(map);
                        })
                });
	
                map.on('mouseleave', name + 'popup', function() {
                        map.getCanvas().style.cursor = '';
                        popup.remove();
                });
                */
            });
        })
    } else {
        map.on("idle", function () {
            (map.getSource(sourceId) as GeoJSONSource).setData(null);
        });
    }
}

function displayAlternate(routes: any, sourceId: string, map: mb.Map) {
    if (routes != undefined) {
        Promise.all(routes).then((result: any) => {
            const geoJson: any = result.map((route) => {
                return {
                    'type': 'Feature',
                    'properties': {},
                    'geometry': {
                        'type': 'LineString',
                        'coordinates': route.data.routes[1].geometry.coordinates
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
    display: display,
    displayRoutes: displayRoutes,
    displayAlternate: displayAlternate,
    displayDestination: displayDestination,
    displayConditionIcon: displayConditionIcon
};
