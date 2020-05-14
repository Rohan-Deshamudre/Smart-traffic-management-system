import * as React from 'react';
import * as _ from 'lodash';

const mbReq = require('mapbox-gl');
import * as mb from 'mapbox-gl';
import ReactResizeDetector from 'react-resize-detector';

import './styles/map.scss';
import asSmallWorkspace from "../containers/SmallWorkspace";
import asLargeWorkspace from "../containers/LargeWorkspace";
import { requests } from "../../helper/requests";
import { mapSetup } from "../../helper/map/mapSetup";
import { mapDisplay } from "../../helper/map/mapDisplay";


type State = {
    mapboxApiToken: string,
    lng: number,
    lat: number,
    zoom: number,
    input: string
}

type Props = {
    setMapStatus: (lat: number, lng: number, zoom: number) => void,
    lng: number,
    lat: number,
    mapLocation: string,
    zoom: number,
    instruments: any,
    client: any,
    scenario: any,
    instrumentActionRoutes: [number, number][][],
    selectedInstrumentActionRoutes: [number, number][][],
    selectedRoute: [number, number][],
    // selectedIcon: any,
    visibleInstruments: any[]
}

class Map extends React.PureComponent<Props, State> {
    private map: mb.Map;
    private directions: any;
    private mapContainer: any;
    private dirContainer: any;

    constructor(props: Props) {
        super(props);

        this.state = {
            input: '',
            mapboxApiToken: 'pk.eyJ1Ijoia2FhbjU4IiwiYSI6ImNqcTczNWczZzI3a3o0M3FudnNqdjJrbHAifQ.FZWwVCNOkDdifgGxn3_D-Q',
            lng: this.props.lng,
            lat: this.props.lat,
            zoom: this.props.zoom
        };

        this.setupMap = this.setupMap.bind(this);
        this.setupDirections = this.setupDirections.bind(this);
        this.getRoadSegmentWayPoints = this.getRoadSegmentWayPoints.bind(this);
        this.getRoutes = this.getRoutes.bind(this);
        this.reloadMap = this.reloadMap.bind(this);
        this.configureSelectedRoute = this.configureSelectedRoute.bind(this);
        this.configureInstrumentActionRoutes = this.configureInstrumentActionRoutes.bind(this);
        this.configureRoadSegment = this.configureRoadSegment.bind(this);
        this.updateMapStatus = this.updateMapStatus.bind(this);
        this.updateInstrumentActionRoutes = this.updateInstrumentActionRoutes.bind(this);
        this.updateDirections = this.updateDirections.bind(this);
        this.updateRoadSegments = this.updateRoadSegments.bind(this);
        this.updateInstrument = this.updateInstrument.bind(this);
        this.updateBoundingBox = this.updateBoundingBox.bind(this);
    }

    componentDidMount(): void {

        const { mapboxApiToken } = this.state;
        const { lng, lat, zoom } = this.props;

        mbReq.accessToken = mapboxApiToken;

        this.setupMap(lng, lat, zoom);
        mapSetup.setupLargeInstruments(this.map);
        mapSetup.setupInstruments(this.map, this.props.client);
        mapSetup.setupSelectedRoutes(this.map);
        this.setupDirections(mbReq.accessToken);
        mapSetup.setupRoutes(this.map);

        mapDisplay.displayInstruments(this.map, this.props.instruments);

        this.configureRoadSegment();
        this.configureInstrumentActionRoutes();

        this.updateMapStatus();

    }

    componentWillUnmount(): void {
        this.map.remove()
    }

    setupMap(lng: number, lat: number, zoom: number): void {
        this.map = new mb.Map({
            container: this.mapContainer,
            style: 'mapbox://styles/mapbox/light-v10',
            center: [lng, lat],
            zoom: zoom
        });
        const that = this;
        this.map.loadImage(
            '../../assets/right-arrow.png',
            function (err, image) {
                if (err) throw err;
                that.map.addImage('arrows', image);
            }
        );
        this.map.on('idle', function () {
            that.updateBoundingBox();
        })
    }

    /*
            Load the MapBox GL Directions Plug-in
     */
    setupDirections(accessToken: string) {
        this.directions = mapSetup.setupDirections(accessToken, this.dirContainer);
        this.map.addControl(this.directions, 'top-left');
        mapDisplay.displayOneMarker(this.directions, this.props.client);
    }

    /*
            Get the full route of the selected instrument action from MapBox API
            Display the route on the map
     */
    configureSelectedRoute() {
        const selectedRoute = this.getRoutes([this.props.selectedRoute]);
        mapDisplay.displayRoutes(selectedRoute, 'selectedRouteSource', this.map);
        //mapDisplay.displayIcons(selectedRoute, 'selectedRouteSource', this.map);
    }

    /*
            Get the full routes of the instrument actions from MapBox API
            Display the routes on the map
     */
    configureInstrumentActionRoutes() {
        const instrumentActionRoutes = this.getRoutes(this.props.instrumentActionRoutes);
        mapDisplay.displayRoutes(instrumentActionRoutes, 'instrumentActionRoutesSource', this.map);
    }

    /*
            Get the full routes of the selected instrument actions from MapBox API
            Display the routes on the map
     */
    configureSelectedInstrumentActionRoutes() {
        const selectedInstrumentActionRoutes = this.getRoutes(this.props.selectedInstrumentActionRoutes);
        mapDisplay.displayRoutes(selectedInstrumentActionRoutes, 'selectedInstrumentActionRoutesSource', this.map);
    }

    /*
            Get the waypoints of the road segments
            Get the full routes from MapBox API
            Display the routes on the map
     */
    configureRoadSegment() {
        const roadSegmentWayPoints = this.getRoadSegmentWayPoints(this.props.scenario, true);
        const roadSegmentRoutes = this.getRoutes(roadSegmentWayPoints);
        mapDisplay.displayRoutes(roadSegmentRoutes, 'roadSegmentRoutesSource', this.map);
    }

    /*
            Loop through the current scenario to retrieve its road segment way points.
     */
    getRoadSegmentWayPoints(scenario: any, flyTo: boolean) {
        if (scenario !== undefined && scenario.children !== undefined) {
            return scenario.children.map((child) => {
                if (child.route && child.route.routePoints && child.route.routePoints[0]) {
                    if (flyTo) {
                        this.map.flyTo({ center: child.route.routePoints[0] });
                    }
                    return child.route.routePoints.map((routePoint) => [routePoint.lng, routePoint.lat]);
                }
            })
        }
    }

    /*
            Get Routes from the MapBox Directions API
            waypoints 	the waypoints to get the directions from
            return 		a complete route
     */
    getRoutes(wayPoints: [number, number][][]) {
        if (wayPoints !== undefined) {
            return wayPoints.filter((route) => route !== undefined && route.length >= 2).map(async (route) => requests.getRoute(route, 'full'));
        }
    }

    /*
            Update the map to the corresponding center
     */
    updateMapStatus() {
        this.map.on('move', () => {
            let { lng, lat } = this.map.getCenter();

            lng = parseFloat(lng.toFixed(4));
            lat = parseFloat(lat.toFixed(4));
            let zoom: number = parseFloat(this.map.getZoom().toFixed(2));

            this.props.setMapStatus(lat, lng, zoom);
            this.setState({
                lng: lng,
                lat: lat,
                zoom: zoom
            });
        });
    }

    /*
            If the instrumentActionRoutes have been changed.
            Center the map to the new instrumentActionRoutes
            Configure the instrument action routes
     */
    updateInstrumentActionRoutes(prevProps: any) {
        if (!(_.isEqual(this.props.instrumentActionRoutes, prevProps.instrumentActionRoutes))) {
            if (this.props.instrumentActionRoutes[0] && this.props.instrumentActionRoutes[0][0]) {
                this.map.flyTo({
                    center: this.props.instrumentActionRoutes[0][0]
                });
            }
            this.configureInstrumentActionRoutes();
        }
    }

    /*
            If directions are initialized, update the directions/local store accordingly
     */
    updateDirections() {
        if (this.directions !== undefined) {
            if (this.props.mapLocation !== '') {
                this.directions.setOrigin(this.props.mapLocation);

                // Set mapLocation to empty string to prevent infinite querying
                this.props.client.writeData({ data: { mapLocation: '' } });

            }
            // Adjust the stores longitude and latitude to be corresponding with the map
            if (this.directions.getOrigin().geometry !== undefined) {
                this.props.client.writeData({
                    data: {
                        longitude: this.directions.getOrigin().geometry.coordinates[0],
                        latitude: this.directions.getOrigin().geometry.coordinates[1]
                    }
                });
            }
        }
    }


    updateRoadSegments(prevProps: any) {
        const currentRoadSegmentWayPoints = this.getRoadSegmentWayPoints(this.props.scenario, false);
        if (!_.isEqual(currentRoadSegmentWayPoints, this.getRoadSegmentWayPoints(prevProps.scenario, false))) {
            const currentRoadSegmentRoutes = this.getRoutes(currentRoadSegmentWayPoints);
            mapDisplay.displayRoutes(currentRoadSegmentRoutes, 'selectedRouteSource', this.map);
        }
    }

    updateInstrument(prevProps: any) {
        if (!_.isEqual(this.props.visibleInstruments, prevProps.visibleInstruments)) {
            mapDisplay.displayLargeInstruments(this.map, this.props.visibleInstruments);
        }
    }

    updateBoundingBox() {
        if (this.map) {
            this.props.client.writeData({
                data: {
                    boundingBox: [[this.map.getBounds().getNorthWest().lng, this.map.getBounds().getNorthWest().lat], [this.map.getBounds().getSouthEast().lng, this.map.getBounds().getSouthEast().lat]]
                }
            })
        }
    }

    componentDidUpdate(prevProps) {
        this.updateDirections();
        this.updateRoadSegments(prevProps);
        this.updateInstrumentActionRoutes(prevProps);
        this.updateInstrument(prevProps);

        if (!_.isEqual(this.props.selectedRoute, prevProps.selectedRoute)) {
            this.configureSelectedRoute();
        }

        if (!_.isEqual(this.props.selectedInstrumentActionRoutes, prevProps.selectedInstrumentActionRoutes)) {
            this.configureSelectedInstrumentActionRoutes();
        }
    }

    reloadMap(): void {
        this.map.resize();
    }

    render() {
        return (
            <div className="map-container">
                <ReactResizeDetector handleWidth handleHeight onResize={(): void => this.reloadMap()} />
                <div ref={el => this.mapContainer = el} className="map" />
            </div>
        );
    }
}

const
    Small = asSmallWorkspace(
        Map
    );

const
    Large = asLargeWorkspace(
        Map
    );

export default {
    Small
    ,
    Large
};



