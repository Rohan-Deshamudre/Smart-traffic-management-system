import * as React from 'react';
import '../styles/pane.scss';
import '../../../components/buttons/styles/paneBottomButtons.scss';

import Button from "react-bootstrap/Button";

// @ts-ignore
import geoFilterIcon from "./../../../assets/geoFilterIcon.svg"

import asRightPane, {InjectedPRightPane} from "../../../components/RightPane";
import Search from "../../../components/other/Search";
import Instrument from "../components/rightPaneComponents/Instrument";
import CreateInstrument from "../components/rightPaneComponents/CreateInstrument";
import ImportInstruments from "../components/rightPaneComponents/ImportInstrument";
import ExportInstruments from "../components/rightPaneComponents/ExportInstrument";
import gql from "graphql-tag";
import {Query, ApolloConsumer} from 'react-apollo';
import {mapHelper} from "../../../helper/map/mapHelper";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

interface PRightPane extends InjectedPRightPane {
	instruments: any,
	instrumentTypes: any,
	currDrip?: number,
	boundingBox: [[number, number], [number, number]]
}

type State = {
	currentInstrumentTypeId: string,
	instruments: any,
	visibleInstruments: any,
	geoFilter: boolean
}

const GET_LOCATION = gql`
    {
        longitude @client
        latitude @client
    }
`;

class RightPane extends React.Component<PRightPane, State, any> {
	constructor(props: PRightPane) {
		super(props);
		this.state = {
			currentInstrumentTypeId: '1',
			instruments: this.props.instruments,
			visibleInstruments: this.props.instruments.filter((a: any) => a.instrumentType.id === '1'),
			geoFilter: true
		};

		this.toggleTab = this.toggleTab.bind(this);
		this.currentInstrumentTypeName = this.currentInstrumentTypeName.bind(this);
	}

	componentDidUpdate(prevProps) {
		if (this.props.instruments !== prevProps.instruments) {
			this.setState({
				instruments: this.props.instruments,
				visibleInstruments: this.props.instruments.filter((a: any) => a.instrumentType.id === this.state.currentInstrumentTypeId)
			});
		}

	}

	toggleTab(selectedTab: string) {
		this.setState({
			currentInstrumentTypeId: selectedTab,
			visibleInstruments: this.state.instruments.filter((a: any) => a.instrumentType.id === selectedTab)
		});
	}

	currentInstrumentTypeName() {
		return this.props.instrumentTypes.filter((instrumentType) => instrumentType.id === this.state.currentInstrumentTypeId).map((instrumentType) => instrumentType.name);
	}

	render() {
		const instruments = this.state.visibleInstruments
			.filter(instrument => {
				if (this.state.geoFilter) {
					if (instrument.lng === undefined || instrument.lat === undefined) {
						return instrument
					} else if (this.props.boundingBox.length > 0 && mapHelper.instrumentWithinBoundingBox([instrument.lng, instrument.lat], this.props.boundingBox)) {
						return instrument
					}
				} else {
					return instrument
				}
			})
			.map((instrument: any) => <div key={instrument.id}
										   className={instrument.id === this.props.currDrip ? 'selected' : ''}>
					<Instrument instrument={{...instrument, type: this.state.currentInstrumentTypeId}}
					/>
				</div>
			);

		const firstThreeInstrumentTypes = this.props.instrumentTypes.slice(0, 3).map((instrumentType) =>
			<Button key={instrumentType.id} onClick={() => this.toggleTab(instrumentType.id)}
					className={this.state.currentInstrumentTypeId === instrumentType.id ? 'active' : ''}>
				{instrumentType.name}
			</Button>
		);

		const otherInstrumentTypes = this.props.instrumentTypes.slice(3).map((instrumentType) =>
			<option key={instrumentType.id} value={instrumentType.id}>{instrumentType.name}</option>
		);

		return (
			<div className="right-pane pane home">

				{/* Top part */}
				<div className="pane-header">
					<span className="d-block header-title">Instrumenten</span>
					<div className="search-bar">
						<div className="search-sort">
							<Search
								items={this.state.instruments.filter((a: any) => a.instrumentType.id === this.state.currentInstrumentTypeId)}
								handleItems={(list: any) => this.setState({visibleInstruments: list})}
								list={[]}
								handleList={(list: any) => {
								}}/>
							<OverlayTrigger key='top' overlay={<Tooltip id='tooltip-top'>Geo-Filter</Tooltip>}>
								<img src={geoFilterIcon} onClick={() => this.setState({geoFilter: !this.state.geoFilter})}
									 alt="Geo Filter Icon"
									 className={this.state.geoFilter ? 'active' : ''}/>
							</OverlayTrigger>

						</div>
					</div>
				</div>

				{/* Tabs */}
				<div className="right-pane-tabs d-flex">
					{firstThreeInstrumentTypes}
					<select className={parseInt(this.state.currentInstrumentTypeId) > 5 ? 'active' : ''}
							onChange={(e: any) => this.toggleTab(e.target.value)}
							value={parseInt(this.state.currentInstrumentTypeId) > 5 ? this.state.currentInstrumentTypeId : '-1'}>
						<option value="-1" disabled hidden>☰</option>
						{otherInstrumentTypes}
					</select>
				</div>

				{/* Instruments and their instrument actions */}
				<div className="instrument-list">
					{instruments}
				</div>

				{/* Create instrument */}
				<Query query={GET_LOCATION}>
					{({data, client}) => (
						<div className="d-flex justify-content-between pane-bottom-buttons">
							<ExportInstruments client={client} instruments={this.props.instruments}/>
							<ImportInstruments client={client}/>
							<CreateInstrument instrumentTypeId={this.state.currentInstrumentTypeId}
											  instrumentTypeName={this.currentInstrumentTypeName()}
											  pointerLng={data.longitude}
											  pointerLat={data.latitude}
							/>
						</div>

					)}
				</Query>
			</div>
		);
	}
}

export default asRightPane(RightPane);
