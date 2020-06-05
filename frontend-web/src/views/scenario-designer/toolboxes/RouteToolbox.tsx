import * as React from 'react';
import LocationSelector from "../../../components/map/LocationSelector";
import '../styles/toolbox.scss';
import * as _ from 'lodash';

type Props = {
	route?: { id: number, lng: number, lat: number }[],
	handleRoute: (newRoute: { id: number, lng: number, lat: number }[]) => void,
	client?: any,
	disabled?: boolean
}

type State = {
	alt: boolean,
	addNewSegmentToggle: boolean
}

/*
	RouteToolbox component
	Used by [AddRoadSegment] in [Scenario-Designer]
	It passes: an array of road segment coordinates to parent.
 */
class RouteToolbox extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			alt: false,
			addNewSegmentToggle: false
		};
		this.handleLocation = this.handleLocation.bind(this);
		this.chooseType = this.chooseType.bind(this);
		this.deleteSegment = this.deleteSegment.bind(this);
	}

	componentDidMount() {
		let routeToBeDrawn: any = [];

		if (this.props.client) {
			routeToBeDrawn = this.props.route.map(
				(routeSegment) => [routeSegment.lng, routeSegment.lat]
			);

			this.props.client.writeData({
				data: {
					selectedRoute: routeToBeDrawn
				}
			});
		}
	}

	handleLocation(newLocation: [number, number]) {
		let newRoute = [...this.props.route, {
			...{lng: newLocation[0], lat: newLocation[1]},
			id: this.props.route.length
		}];
		this.setState({
			addNewSegmentToggle: false
		});

		this.props.handleRoute(newRoute);
	}

	deleteSegment(segmentId: number) {
		let newRoute = this.props.route;
		newRoute = newRoute.filter((routeSegment) => {
			return routeSegment.id !== segmentId
		});

		this.setState({
			addNewSegmentToggle: false
		});

		this.props.handleRoute(newRoute);
	}

	chooseType() {
		this.setState({
			alt: true
		});
	}

	componentDidUpdate(prevProps) {
		let routeToBeDrawn: any = [];
		if (!_.isEqual(this.props.route, prevProps.route) && this.props.client) {
			routeToBeDrawn = this.props.route.map((routeSegment) => [routeSegment.lng, routeSegment.lat]);
			this.props.client.writeData({
				data: {
					selectedRoute: routeToBeDrawn
				}
			});
		}
	}

	render() {
		let currentRoutes = this.props.route.map((routeSegment) =>
			<div className="route-item" key={routeSegment.id}>
				<div className="route-item-body">
					<div className="text">Lng:</div>
					<div className="number">{routeSegment.lng}</div>
					<div className="text">Lat:</div>
					<div className="number">{routeSegment.lat}</div>
				</div>
				{!this.props.disabled ? (
					<div onClick={
						() => this.deleteSegment(routeSegment.id)
					} className="close-button">
						x
					</div>
				) : null}
			</div>
		);

		return (
			<div className="toolbox">
				<input type="checkbox" name="alt_route" id="alt_route_check"
					onClick={
						this.chooseType
					}
				/>
				{currentRoutes}
				{!this.props.disabled ? (
					this.state.addNewSegmentToggle ? (
						<LocationSelector handleLocation={this.handleLocation}/>
					) : (
						<div className="add-new">
							<div onClick={() => this.setState({addNewSegmentToggle: true})}>
								Voeg nieuw segment toe
							</div>
						</div>
					)
				) : null}
			</div>
		);
	}
}

export default RouteToolbox;
