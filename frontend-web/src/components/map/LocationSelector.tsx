import * as React from 'react';
import '../styles/locationSelector.scss';
import Button from "react-bootstrap/Button";
import gql from "graphql-tag";
import {Query} from 'react-apollo';
import * as mb from 'mapbox-gl';


type Props = {
	handleLocation: ((a: [number, number]) => void),
	longitude?: number,
	latitude?: number
}

type State = {
	longitude: number,
	latitude: number,
	active: boolean,
	oldLng: number,
	oldLat: number
}


const GET_LOCATIONSELECTOR = gql`
    {
        longitude @client
        latitude @client
    }
`;

class LocationSelector extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			longitude: this.props.longitude === undefined ? undefined : this.props.longitude,
			latitude: this.props.latitude === undefined ? undefined : this.props.latitude,
			active: false,
			oldLng: undefined,
			oldLat: undefined
		};
		this.handleLocation = this.handleLocation.bind(this);
		this.active = this.active.bind(this);
	}

	handleLocation([longitude, latitude]: [number, number]) {
		if(longitude !== 0 && latitude !== 0) {
			this.props.handleLocation([longitude, latitude]);
			this.setState({
				oldLng: longitude,
				oldLat: latitude,
				active: true
			})
		}
	}

	active([longitude, latitude]: [number, number]) {
		return this.state.active && this.state.oldLng === longitude && this.state.oldLat === latitude;
	}


	render() {
		return (
			<Query query={GET_LOCATIONSELECTOR}>
				{({data}) => {

					return (
						<div className="location-selector">

							{/* Set-location button */}
							<div className="d-flex justify-content-between align-items-center wrap">
								<span className="title">Klik op de kaart</span>
							</div>

							{/* Set-location input fields */}
							<div className="d-flex justify-content-between align-items-center wrap">
								<div>
									<span>Long</span>
									<div>{this.props.longitude ? this.props.longitude : data.longitude}</div>
								</div>
								<div>
									<span>Lat</span>
									<div>{this.props.latitude ? this.props.latitude : data.latitude}</div>
								</div>
							</div>

							{this.props.latitude &&
							<div className="d-flex justify-content-between align-items-center wrap">
								<div>
									<span>Nieuwe Longitude</span>
									<div>{data.longitude}</div>
								</div>
								<div>
									<span>Nieuwe Latitude</span>
									<div>{data.latitude}</div>
								</div>
							</div>
							}
							<Button variant={this.active([data.longitude, data.latitude]) ? 'success' : 'primary'}
									onClick={() => this.handleLocation([data.longitude, data.latitude])}>
								{this.active([data.longitude, data.latitude]) ? 'Opgeslagen !' : 'Sla locatie op'}</Button>

						</div>
					);

				}}
			</Query>
		);
	}
}

export default LocationSelector;
