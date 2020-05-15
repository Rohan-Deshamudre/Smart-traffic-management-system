import * as React from 'react';

import '../styles/pane.scss';
import '../../../components/buttons/styles/paneBottomButtons.scss';
import * as _ from 'lodash';


import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";

// @ts-ignore
import sortAIcon from "./../../../assets/sortA.svg";
// @ts-ignore
import sortAAscIcon from "./../../../assets/sortAAsc.svg";
// @ts-ignore
import sortNewIcon from "./../../../assets/sortNew.svg"
// @ts-ignore
import sortNewAscIcon from "./../../../assets/sortNewAsc.svg"
// @ts-ignore
import geoFilterIcon from "./../../../assets/geoFilterIcon.svg"

import asLeftPane, { InjectedPLeftPane } from "../../../components/LeftPane";
import { default as Folder } from '../components/Folder';
import AddFolder from '../components/AddFolder';
import Search from "../../../components/other/Search";
import AddScenario from "../components/AddScenario";
import Item from "../components/Item";
import ImportTree from "../components/ImportTree";
import { Query } from 'react-apollo';
import { READ_LABELS } from '../../../components/ReadOnlyLabels';
import { mapHelper } from "../../../helper/map/mapHelper";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";


type List = { id: number, name: string, folderType: { id: number }, items: { id: number, name: string }[] }[];
type AbstractItemList = { id: number, name: string, labels: any[] }[]

interface PLeftPane extends InjectedPLeftPane {
	folders: List,
	scenarios: AbstractItemList,
	boundingBox: [[number, number], [number, number]]
}

type State = {
	visibleFolders: List
	visibleScenario: any[]
	onNew: boolean,
	newDesc: boolean,
	aDesc: boolean,
	geoFilter: boolean
}


class LeftPane extends React.Component<PLeftPane, State> {
	constructor(FolderProps: PLeftPane) {
		super(FolderProps);
		this.state = {
			visibleFolders: this.props.folders,
			visibleScenario: this.props.scenarios,
			onNew: true,
			newDesc: true,
			aDesc: true,
			geoFilter: true
		};
		this.handleList = this.handleList.bind(this);
		this.handleItems = this.handleItems.bind(this);
		this.sort = this.sort.bind(this);
	}

	componentDidUpdate(prevProps) {
		if (!_.isEqual(this.props.folders, prevProps.folders)) {
			this.setState({
				visibleFolders: this.props.folders
			});
		}
		if (!_.isEqual(this.props.scenarios, prevProps.scenarios)) {
			this.setState({
				visibleScenario: this.props.scenarios
			});
		}
	}

	handleList(list: List) {
		this.setState({ visibleFolders: list });
	}

	handleItems(list: any[]) {
		this.setState({ visibleScenario: list });
	}

	sort() {
		if (this.state.onNew) {
			this.setState({
				onNew: false,
				newDesc: true,
				visibleFolders: this.state.visibleFolders.sort(function (a, b) {
					const nameA = a.name.toUpperCase(); // ignore upper and lowercase
					const nameB = b.name.toUpperCase(); // ignore upper and lowercase
					if (nameA < nameB) {
						return -1;
					}
					if (nameA > nameB) {
						return 1;
					}

					// names must be equal
					return 0;
				}),
				visibleScenario: this.state.visibleScenario.sort(function (a, b) {
					const nameA = a.name.toUpperCase(); // ignore upper and lowercase
					const nameB = b.name.toUpperCase(); // ignore upper and lowercase
					if (nameA < nameB) {
						return -1;
					}
					if (nameA > nameB) {
						return 1;
					}
					return 0;
				})
			});
		} else {
			this.setState({
				aDesc: !this.state.aDesc,
				visibleFolders: this.state.visibleFolders.reverse(),
				visibleScenario: this.state.visibleScenario.reverse()
			})
		}

	}

	sortNew() {
		if (!this.state.onNew) {
			this.setState({
				onNew: true,
				aDesc: true,
				visibleFolders: this.state.visibleFolders.sort(function (a, b) {
					if (a.id < b.id) {
						return -1;
					}
					if (a.id > b.id) {
						return 1;
					}
				}),
				visibleScenario: this.state.visibleScenario.sort(function (a, b) {
					if (a.id < b.id) {
						return -1;
					}
					if (a.id > b.id) {
						return 1;
					}
				}),
			})
		} else {
			this.setState({
				newDesc: !this.state.newDesc,
				visibleFolders: this.state.visibleFolders.reverse(),
				visibleScenario: this.state.visibleScenario.reverse()
			})
		}
	}

	render() {
		const folders = this.state.visibleFolders.map((folder: any) =>
			<Folder folder={folder} key={folder.id} folders={this.props.folders} boundingBox={this.props.boundingBox}
				geoFilter={this.state.geoFilter} />);

		const scenariosWithoutFolders = this.state.visibleScenario
			.filter((scenario: any) => {
				if (this.state.geoFilter) {
					if (scenario.startLng === 0 || this.props.boundingBox.length > 0 && mapHelper.isWithinBoundingBox([[scenario.startLng, scenario.startLat], [scenario.endLng, scenario.endLat]], this.props.boundingBox)) {
						return scenario
					}
				} else {
					return scenario
				}
			})
			.map((scenario: any) => {
				return <Item name={scenario.name} id={scenario.id} folderId={scenario.folderId} key={scenario.id}
					folders={this.props.folders} labels={scenario.labels} description={scenario.description}
					className="folder" />

			});

		return (
			<div className="d-flex flex-column pane left-pane">
				<div className="pane-header">
					<span className="d-block header-title">Scenario's</span>
					<div className="search-bar">
						<div className="search-sort">
							<Search list={this.props.folders} items={this.props.scenarios} handleList={this.handleList}
								handleItems={this.handleItems} />
							<OverlayTrigger key='left' overlay={<Tooltip id='tooltip-top'>Sort by creation date</Tooltip>}>
								<img src={this.state.newDesc ? sortNewIcon : sortNewAscIcon} onClick={() => this.sortNew()}
									alt="Sort new"
									className={this.state.onNew ? 'active' : ''} />
							</OverlayTrigger>
							<OverlayTrigger key='middle' overlay={<Tooltip id='tooltip-top'>Sort alphabetically</Tooltip>}>
								<img src={this.state.aDesc ? sortAIcon : sortAAscIcon} onClick={() => this.sort()}
									alt="Sort Icon"
									className={!this.state.onNew ? 'active' : ''} />
							</OverlayTrigger>
							<OverlayTrigger key='right' overlay={<Tooltip id='tooltip-top'>Geo-Filter</Tooltip>}>
								<img src={geoFilterIcon} onClick={() => this.setState({ geoFilter: !this.state.geoFilter })}
									alt="Geo Filter Icon"
									className={this.state.geoFilter ? 'active' : ''} />
							</OverlayTrigger>
						</div>
					</div>
				</div>

				<div className="middle">
					{folders}
					{scenariosWithoutFolders}
				</div>

				<Query query={READ_LABELS}>
					{({ loading, error, data, client }) => {
						let labels = []
						if (loading) return <div className="container-center"><div className="loader"></div></div>;
						if (!error) {
							labels = data.labels
						} else {
							console.log(error)
						}
						return (
							<div className="d-flex justify-content-between pane-bottom-buttons">
								<AddFolder
									parentId={null} />{/* TODO When folders-in-folders are implemented, change parentId */}
								<AddScenario labels={labels} />
								<ImportTree client={client} />
							</div>
						);
					}}
				</Query>
			</div>
		);
	}
}

export default asLeftPane(LeftPane);
