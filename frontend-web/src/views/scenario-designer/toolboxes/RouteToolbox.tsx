import * as React from 'react';
import LocationSelector from "../../../components/map/LocationSelector";
import '../styles/toolbox.scss';
import * as _ from 'lodash';
import {useEffect, useState} from "react";

type Props = {
	route?: { id: number, lng: number, lat: number }[],
	handleRoute: (newRoute: { id: number, lng: number, lat: number }[]) => void,
	client?: any,
	disabled?: boolean
}
/*
	RouteToolbox component
	Used by [AddRoadSegment] in [Scenario-Designer]
	It passes: an array of road segment coordinates to parent.
 */
export default function RouteToolbox(props: Props) {
	const [addNewSegmentToggle, setAddNewSegmentToggle] = useState(false);

	function handleLocation(newLocation: [number, number]) {
		let newRoute = [...props.route, {
			...{ lng: newLocation[0], lat: newLocation[1] },
			id: props.route.length
		}];
		setAddNewSegmentToggle(false);
		props.handleRoute(newRoute);
	}

	function deleteSegment(segmentId: number) {
		let newRoute = props.route;
		newRoute = newRoute.filter((routeSegment) => {
			return routeSegment.id !== segmentId
		});
		setAddNewSegmentToggle(false);
		props.handleRoute(newRoute);
	}

	useEffect(() => {
		let routeToBeDrawn: any = [];
		if (props.client) {
			routeToBeDrawn = props.route.map((routeSegment) => [routeSegment.lng, routeSegment.lat]);
			props.client.writeData({
				data: {
					selectedRoute: routeToBeDrawn
				}
			});
		}
	});

	useEffect(() => {
		let routeToBeDrawn: any = [];
		if (props.client) {
			routeToBeDrawn = props.route.map((routeSegment) => [routeSegment.lng, routeSegment.lat]);
			props.client.writeData({
				data: {
					selectedRoute: routeToBeDrawn
				}
			});
		}
	}, [props.route]);

	let currentRoutes = props.route.map((routeSegment) =>
		<div className="route-item" key={routeSegment.id}>
			<div className="route-item-body">
				<div className="text">Lng:</div>
				<div className="number">{routeSegment.lng}</div>
				<div className="text">Lat:</div>
				<div className="number">{routeSegment.lat}</div>
			</div>
			{!props.disabled ? <div onClick={() => deleteSegment(routeSegment.id)} className="close-button">x</div> : null}
		</div>
	);

	return (
		<div className="toolbox">
			{currentRoutes}
			{!props.disabled ? (
				addNewSegmentToggle ? (
					<LocationSelector handleLocation={handleLocation} />
				) : (
					<div className="add-new">
						<div onClick={() => setAddNewSegmentToggle(true)}>
							Voeg nieuw segment toe
						</div>
					</div>
				)
			) : null}
		</div>
	);
}

