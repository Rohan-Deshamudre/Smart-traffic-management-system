import * as mb from 'mapbox-gl';
import * as MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions'

/*
	Add source, image and layer to the map for all instruments
 */
function setupInstruments(map: mb.Map, client: any) {

    map.on("load", function () {
        map.addSource("drips", {
            type: "geojson",
            data: null
        });

        map.loadImage('../../assets/drip.png', function (error, image) {
            if (error) throw error;

            map.addImage('dripImage', image);

            map.addLayer({
                id: "dripLarge",
                type: "symbol",
                source: "drips",
                minzoom: 15,
                layout: {
                    'text-field': ['get', 'name'],
                    'icon-image': 'dripImage',
                    'icon-text-fit': 'both',
                    'icon-text-fit-padding': [6, 9, 6, 9],
                    'text-size': 10
                },
                paint: {
                    "icon-opacity": 0.8,
                    "text-color": "#ffffff"

                }
            });
        });

        map.loadImage('../../assets/dripSmall.png', function (error, image) {
            map.addImage('dripSmallImage', image);

            map.addLayer({
                id: "dripSmall",
                type: "symbol",
                source: "drips",
                minzoom: 10,
                maxzoom: 15,
                layout: {
                    'icon-image': 'dripSmallImage',
                    'icon-size': 0.5,
                    'icon-rotate': ['get', 'bearing'],
                    'icon-anchor': 'top-left',
                    'icon-offset': [7, 0],
                    'icon-allow-overlap': true,
                    'icon-ignore-placement': true
                },
                paint: {
                    "icon-opacity": 0.5,
                    "text-color": "#ffffff"
                }
            });
        });

        map.on("mouseenter", "dripLarge", function () {
            map.getCanvas().style.cursor = "crosshair";
        });

        map.on('click', 'dripLarge', function (e: any) {
            client.writeData({
                data: {
                    currDripId: e.features[0]._vectorTileFeature.properties.id
                }
            });
        });

        map.on("mouseleave", "dripLarge", function () {
            map.getCanvas().style.cursor = "";
        });
    });
}

/*
	Add source, image and layer to the map for selected instrument
 */
function setupLargeInstruments(map: mb.Map) {
    map.on('load', function () {
        map.loadImage('../../assets/drip.png', function (error, image) {
            if (error) throw error;
            map.addImage('largeDripImage', image);

            map.addSource("largeInstrumentsSource", {
                "type": "geojson",
                "data": null
            });

            map.addLayer({
                id: "largeInstrumentsLayer",
                type: "symbol",
                maxzoom: 15,
                source: "largeInstrumentsSource",
                layout: {
                    'icon-image': 'largeDripImage',
                    'icon-text-fit': 'both',
                    'icon-size': [
                        'interpolate', ['linear'], ['zoom'],
                        10, 0.5,
                        15, 1,
                    ],
                    'icon-anchor': 'top-left',
                    'icon-text-fit-padding': [10, 10, 10, 10],
                    'text-offset': [5, 2],
                    'text-size': [
                        'interpolate', ['linear'], ['zoom'],
                        10, 1,
                        15, 16,
                    ],
                    'icon-allow-overlap': true,
                    'icon-ignore-placement': true,
                    'text-allow-overlap': true,
                    'text-ignore-placement': true,
                    'text-field': ['get', 'text'],
                    'visibility': 'visible'
                },
                paint: {
                    "icon-opacity": 0.5,
                    "text-color": "#ffffff"

                }
            });
        });
    });
}

/*
	Set-up the MapBox GL Directions Plug-in
 */
function setupDirections(accessToken: string, dirContainer: any) {
    return new MapboxDirections({
        container: dirContainer,
        styles: [
            {
                'id': 'directions-origin-point',
                'type': 'circle',
                'source': 'directions',
                'paint': {
                    'circle-radius': 8,
                    'circle-opacity': 0,
                    'circle-stroke-width': 1,
                    'circle-stroke-color': '#111111'
                },
                'filter': [
                    'all',
                    ['in', '$type', 'Point'],
                    ['in', 'marker-symbol', 'A']
                ]
            }, {
                'id': 'directions-origin-label',
                'type': 'symbol',
                'source': 'directions',
                'layout': {
                    'text-field': '+',
                    'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
                    'text-size': 10
                },
                'paint': {
                    'text-color': '#111111'
                },
                'filter': [
                    'all',
                    ['in', '$type', 'Point'],
                    ['in', 'marker-symbol', 'A']
                ]
            }
        ],
        accessToken: accessToken,
        unit: 'metric',
        profile: 'mapbox/driving',
        controls: {
            inputs: false,
            instructions: false,
            profileSwitcher: false
        }
    });
}

function setupRoutes(map: mb.Map) {
    map.on("load", function () {
        map.addSource('roadSegmentRoutesSource', {
            'type': 'geojson',
            'data': null
        });

        map.addSource('instrumentActionRoutesSource', {
            'type': 'geojson',
            'data': null
        });


        ['roadSegmentRoutes', 'instrumentActionRoutes'].forEach((name, index) => {
            map.addLayer({
                'id': name + 'Layer',
                'type': 'line',
                'source': name + 'Source',
                'layout': {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                'paint': {
                    'line-opacity': 0.4,
                    'line-color': '#00FF00',
                    'line-width': 4
                }
            });

            map.addLayer({
                'id': name + 'ArrowsLayer',
                'type': 'symbol',
                'source': name + 'Source',
                'layout': {
                    'symbol-placement': 'line',
                    'symbol-spacing': 150,
                    'icon-allow-overlap': true,
                    'icon-ignore-placement': true,
                    'icon-size': 0.4,
                    'icon-image': 'arrows',
                    'visibility': 'visible'
                }
            });

        });
    });
}

function setupSelectedRoutes(map: mb.Map) {
    map.on("load", function () {
        [
            'selectedRoute',
            'selectedInstrumentActionRoutes',
            'alternativeRoute',
            'conditionIcon'
        ].forEach((name, index) => {
            map.addSource(name + 'Source', {
                'type': 'geojson',
                'data': null
            });

            map.addLayer({
                'id': name + 'Layer',
                'type': 'line',
                'source': name + 'Source',
                'layout': {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                'paint': {
                    'line-opacity': 1,
                    'line-color': (name === 'alternativeRoute') ? '#00FF00' : '#FF0000',
                    'line-width': 6
                }
            });

            map.addLayer({
                'id': name + 'ArrowsLayer',
                'type': 'symbol',
                'source': name + 'Source',
                'layout': {
                    'symbol-placement': 'line',
                    'symbol-spacing': 150,
                    'icon-allow-overlap': true,
                    'icon-ignore-placement': true,
                    'icon-size': 0.4,
                    'icon-image': 'arrows',
                    'visibility': 'visible'
                }
            });

        });

    });
}

export const mapSetup = {
    setupInstruments: setupInstruments,
    setupLargeInstruments: setupLargeInstruments,
    setupDirections: setupDirections,
    setupRoutes: setupRoutes,
    setupSelectedRoutes: setupSelectedRoutes
};
