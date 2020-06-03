import * as React from 'react';
import Name from "../../../../components/other/Name";
import Button from "react-bootstrap/Button";
import RouteToolbox from "../RouteToolbox";
import Type from "../../../../components/other/Type";
import {Query, ApolloConsumer} from 'react-apollo';
import {GET_ROAD_SEGMENT_TYPES} from "./RoadSegmentToolboxQueries";
import AlternateRouteToolbox from "../AlternateRouteToolbox";


type Props = {
	id: number,
	data?: any,
	handleData: (newData: any) => void,
	readOnly?: boolean
}

type State = {
	name: string,
	route: { id: number, lat: number, lng: number }[],
	altRoute: { id: number, lat: number, lng: number }[],

	roadSegmentTypeId: number,
	saved: boolean,
	disabled: boolean
}

/*
	AddRoadSegment component
	Used by [AddRoadSegment] in [Scenario-Designer]
	Shows corresponding input fields for a RoadSegment type in the decision tree
	It passes: state to parent.
 */
class RoadSegmentToolbox extends React.Component<Props, State> {
	baseState: State = {
		name: '',
		route: [],
		altRoute: [],
		roadSegmentTypeId: -1,
		saved: true,
		disabled: true
	};

	constructor(props: Props) {
		super(props);

		this.state = this.baseState;

		if (this.props.data !== undefined) {
			let {data} = this.props;
			this.state = {
				...this.state,
				name: data.roadSegments[0].name,
				route: data.roadSegments[0].route.routePoints,
				// altRoute: data.roadSegments[0].altRoute.routePoints,
				roadSegmentTypeId: data.roadSegments[0].roadSegmentType.id
			}
		}

		this.handleName = this.handleName.bind(this);
		this.handleData = this.handleData.bind(this);
		this.handleRoute = this.handleRoute.bind(this);
		this.handleAlternateRoute = this.handleAlternateRoute.bind(this);
		this.handleRoadSegmentType = this.handleRoadSegmentType.bind(this);
		this.disabled = this.disabled.bind(this);
	}

	componentDidUpdate(prevProps: Props) {
		if (this.props.id !== prevProps.id && this.props.data === undefined) {
			this.setState({
				...this.baseState
			})
		}
	}

	resetState() {
		if (this.props.data === undefined) {
			this.setState({
				...this.baseState
			})
		} else {
			this.setState({
				saved: true,
				disabled: true
			})
		}
	}

	handleData() {
		this.props.handleData({
			name: this.state.name,
			roadSegmentTypeId: this.state.roadSegmentTypeId,
			route: this.state.route.map(route => ({lng: route.lng, lat: route.lat})),
			altRoute: this.state.altRoute.map(altRoute => ({lng: altRoute.lng, lat: altRoute.lat}))
		});
	}

	handleName(newName: string) {
		this.setState({
			name: newName,
			saved: false,
		}, () => this.disabled());
	}

	handleRoute(newRoute: { id: number, lng: number, lat: number }[]) {
		this.setState({
			route: newRoute,
			saved: false,
		}, () => this.disabled());
	}

	handleAlternateRoute(newRoute: { id: number, lng: number, lat: number }[]) {
		this.setState({
			altRoute: newRoute,
			saved: false,
		}, () => this.disabled());
	}

	handleRoadSegmentType(newID: number) {
		this.setState({
			roadSegmentTypeId: newID,
			saved: false,
		}, () => this.disabled());
	}

	disabled() {
		this.setState({
			disabled: (
				this.state.name === ""
				|| this.state.route === undefined
					|| this.state.altRoute === undefined
				|| this.state.roadSegmentTypeId < 0
			)
		});
	}

	render() {
		const disabled = this.state.disabled ? ' disabled' : '';
		const success = this.state.saved ? ' btn-success' : '';

		const roadsegmentTypes = (
			<Query query={GET_ROAD_SEGMENT_TYPES}>
				{({data, loading, error}) => {
					if (loading) return <p>Loading</p>;
					if (error) return <p>Error</p>;
					return (
						<Type selectedId={this.state.roadSegmentTypeId} disabled={this.props.readOnly} handleType={this.handleRoadSegmentType}
							  types={data.roadSegmentTypes}/>
					);
				}}
			</Query>
		);

		return (
			<div className="toolbox">
				<Name name={this.state.name} handleName={this.handleName} disabled={this.props.readOnly}/>
				<ApolloConsumer>
					{client => (
						<RouteToolbox route={this.state.route} client={client} disabled={this.props.readOnly} handleRoute={this.handleRoute}/>
					)}
				</ApolloConsumer>
				<p>Select road segment type:</p>
				{roadsegmentTypes}
				<br/>
				<p>Mark alternate route:</p>
				<ApolloConsumer>
					{client => (
						<AlternateRouteToolbox altRoute={this.state.altRoute} client={client} disabled={this.props.readOnly} handleAltRoute={this.handleAlternateRoute}/>
					)}
				</ApolloConsumer>

				{!this.props.readOnly && (
					<Button className={"opslaan-button" + disabled + success} onClick={() => {
						if (!this.state.saved && !this.state.disabled) {
							this.handleData();
							this.resetState()
						}
					}}>
						{this.state.saved ? "Opgeslagen!" : "Item opslaan"}
					</Button>
				)}
			</div>
		);
	}
}

export default RoadSegmentToolbox;
