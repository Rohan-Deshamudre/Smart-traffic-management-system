import * as React from 'react';
import { useState, useEffect } from 'react';
import LocationSelector from "../../../components/map/LocationSelector";
import '../styles/toolbox.scss';

type Props = {
    alternativeRoute?: { id: number, lng: number, lat: number }[],
    handleAltRoute: (newRoute: { id: number, lng: number, lat: number }[]) => void,
    client?: any,
    disabled?: boolean
}

export default function AlternateRouteToolbox(props: Props) {
    const [addNewSegmentToggle, setAddNewSegmentToggle] = useState(false);

    function handleLocation(newLocation: [number, number]) {
        let newRoute = [...props.alternativeRoute, {
            ...{ lng: newLocation[0], lat: newLocation[1] },
            id: props.alternativeRoute.length
        }];
        setAddNewSegmentToggle(false);
        props.handleAltRoute(newRoute);
    }

    function deleteSegment(segmentId: number) {
        let newRoute = props.alternativeRoute;
        newRoute = newRoute.filter((routeSegment) => {
            return routeSegment.id !== segmentId
        });
        setAddNewSegmentToggle(false);
        props.handleAltRoute(newRoute);
    }

    useEffect(() => {
        let routeToBeDrawn: any = [];
        if (props.client) {
            routeToBeDrawn = props.alternativeRoute.map((routeSegment) => [routeSegment.lng, routeSegment.lat]);
            props.client.writeData({
                data: {
                    alternativeRoute: routeToBeDrawn
                }
            });
        }
    });

    useEffect(() => {
        let routeToBeDrawn: any = [];
        if (props.client) {
            routeToBeDrawn = props.alternativeRoute.map((routeSegment) => [routeSegment.lng, routeSegment.lat]);
            props.client.writeData({
                data: {
                    alternativeRoute: routeToBeDrawn
                }
            });
        }
    }, [props.alternativeRoute]);

    let currentRoutes = props.alternativeRoute.map((routeSegment) =>
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
