import * as React from 'react';
import asSmallWorkspace from "../containers/SmallWorkspace";
import asLargeWorkspace from "../containers/LargeWorkspace";
import '../styles/tree.scss';
import {hierarchy, tree, select, linkHorizontal, zoom} from 'd3';
import * as d3 from 'd3';
import {DefaultLinkObject, Link} from "d3-shape";
import TreeLevelButton from "../buttons/TreeLevelButton";
import * as _ from 'lodash';
import {treeDraw} from "../../helper/tree/treeDraw";
import {selectAll} from "d3-selection";


type Props = {
	treeTransform: any,
	scenario: any,
	client: any,
	upToDate: boolean,
	deactivatedNodes: { typename: string, id: number }[],
	treeLevel: number
}

type State = {
	minimizedNodes: { typename: string, id: number }[],
	zoom: number,
	treeHeight: number,
	treeLevel: number,
	curNodeId: number,
	curNodeType: string
}

class Tree extends React.Component<Props, State> {
	private readonly chartRef: React.LegacyRef<HTMLDivElement>;

	constructor(props: Props) {
		super(props);

		this.state = {
			curNodeId: -1,
			curNodeType: null,
			zoom: 0.5,
			minimizedNodes: [],
			treeHeight: 1,
			treeLevel: -1
		};

		this.createTree = this.createTree.bind(this);
		this.chartRef = React.createRef();
		this.addButtonFunctionality = this.addButtonFunctionality.bind(this);
		this.toggleVisibilityButtonFunctionality = this.toggleVisibilityButtonFunctionality.bind(this);
		this.minimizeChildren = this.minimizeChildren.bind(this);
		this.addChildren = this.addChildren.bind(this);
		this.hasChild = this.hasChild.bind(this);
		this.editNode = this.editNode.bind(this);
		this.addNode = this.addNode.bind(this);
		this.getVisibleTree = this.getVisibleTree.bind(this);
		this.minimizeChildrenLevel = this.minimizeChildrenLevel.bind(this)
		this.updateMinimizedNodes = this.updateMinimizedNodes.bind(this);
		this.handleLevel = this.handleLevel.bind(this)

	}

	componentDidMount() {
		if (this.props.scenario !== undefined) {
			const hierarchyData = hierarchy(this.props.scenario).sum(function (d) {
				return d.value
			});

			this.props.client.writeData({data: {treeHeight: hierarchyData.height}});
			this.setState({treeHeight: hierarchyData.height}, () => {
				if(this.props.treeLevel !== -1) { this.handleLevel(this.props.treeLevel) }
				this.createTree(this.getVisibleTree(), this.props.treeTransform);
			});
		}
	}

	componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
		if (!_.isEqual(this.props.scenario, prevProps.scenario)) {
			select('svg').remove();
			this.createTree(this.getVisibleTree(), this.props.treeTransform);
		}

		if (this.props.treeLevel !== prevProps.treeLevel) {
			this.handleLevel(this.props.treeLevel);
		}

	}

	getVisibleTree() {
		let tree = this.props.scenario;

		let nodes = this.removeBothDuplicatesAndMerge(this.state.minimizedNodes, this.props.deactivatedNodes);

		for (let i = 0; i < nodes.length; i++) {
			tree = this.minimizeChildren(nodes[i].id, nodes[i].typename, tree);
		}

		return tree
	}

	/**
	 * Remove both entries when there is a duplicate entry
	 * @param arrayA
	 * @param arrayB
	 */
	removeBothDuplicatesAndMerge(arrayA, arrayB) {
		let nodes = [...arrayA];
		for (let i = 0; i < arrayB.length; i++) {
			let alreadyIn = false;
			for (let j = 0; j < nodes.length; j++) {
				if (_.isEqual(arrayB[i], nodes[j])) {
					alreadyIn = true;
					nodes.splice(j, 1);
					break;
				}
			}

			if (!alreadyIn) {
				nodes = [...nodes, arrayB[i]];
			}
		}
		return nodes;
	}

	createTree(scenario, initTransformStatus) {
		let width: number = window.innerWidth;
		let height: number = window.innerHeight;

		let dragOffset: number = 0;

		let that = this;

		const hierarchyData = hierarchy(scenario).sum(function (d) {
			return d.value
		});

		let treeMain = tree()
			.nodeSize([200, 200])
			.separation(function (a, b) {
				return (a.parent === b.parent ? 1 : 1.25)
			});

		// This is written to let the data be displayed horizontally x, y interchange
		const renderLink: Link<any, DefaultLinkObject, [number, number]> = linkHorizontal().x(function (d: any) {
			return d.y
		}).y(function (d: any) {
			return d.x - 20
		});

		// Create svg
		let svg = select('.treeLayout')
			.append('svg')
			.attr('width', width)
			.attr('height', height);

		let g = svg.append('g');
		treeMain(hierarchyData);
		const nodes = hierarchyData.descendants();
		const links = hierarchyData.links();

		// draw a line
		g.selectAll()
			.data(links)
			.enter()
			.append('path')
			.attr('class', 'link')
			.attr('d', function (d: any) {
				return renderLink(d)
			});

		let zoom = d3.zoom()
			.extent([[10, 10], [width + 1000, height]])
			.scaleExtent([0.2, 10])
			.on("zoom", zoomed);

		svg.call(zoom) // here
			.call(zoom.transform, d3.zoomIdentity.translate(initTransformStatus.x, initTransformStatus.y).scale(initTransformStatus.k))
			.append("svg:g")
			.attr("transform", "translate(" + initTransformStatus.x + ", " + initTransformStatus.y + ") scale(" + initTransformStatus.k + ", " + initTransformStatus.k + ")");

		function zoomed() {
			let treeHeight = svg.node().getBBox().height;
			let treeWidth = svg.node().getBBox().width;

			let xOffset = d3.event.transform.k * dragOffset + treeWidth;
			let yOffset = d3.event.transform.k * dragOffset + treeHeight;
			let x = d3.event.transform.x;
			if (x > width + xOffset) {
				d3.event.transform.x = width + xOffset;
			} else if (x < -xOffset) {
				d3.event.transform.x = -xOffset
			}

			let y = d3.event.transform.y;
			if (y > height + yOffset) {
				d3.event.transform.y = height + yOffset;
			} else if (y < 0 - yOffset) {
				d3.event.transform.y = -yOffset;
			}

			g.attr("transform", d3.event.transform);
			that.props.client.writeData({
				data: {
					treeTransform: [d3.event.transform.k, x, y]
				}
			});
		}

		// draw the node
		let node = g.selectAll()
			.data(nodes)
			.enter()
			.append('g')
			.on("mouseenter", function (d: any, i: number) {
				treeDraw.drawButtons(this, d, i, that);
				treeDraw.drawConditionHover(this, d, i);
			})
			.on("mouseleave", function (d: any, i: number) {
				g.selectAll('#buttons-' + i).remove();
				g.selectAll('#road-condition-hover-' + i).remove();
			})
			.attr('class', function (d: any) {
				let className = 'node ';
				if (!d.data.active) {
					className += 'deactivated ';
				} else {
					className += 'activated ';
				}
				switch (d.data.__typename) {
					case 'ScenarioObjectType':
						className += 'scenario';
						break;
					case 'RoadSegmentObjectType':
						className += 'roadsegment';
						break;
					case 'RoadConditionObjectType':
						className += 'condition';
						break;
					case 'RoadConditionActionObjectType':
						className += 'action';
						break;
					default:
						className += 'constraint';
				}
				return className;
			})
			.attr('transform', function (d: any) {
				return `translate(${d.y}, ${d.x})`
			});

		// draw rect
		let nodeContent = node
			.append('g')
			.attr('class', 'node-content')
			.on('click', function (d: any) {
				const element = select(this);
				that.editNode(d, element)
			});

		let nodesExceptRoadConditionAction = nodeContent.filter(d => d.data.__typename !== 'RoadConditionActionObjectType');

		treeDraw.drawNodes(nodesExceptRoadConditionAction);
		treeDraw.drawIcon(nodesExceptRoadConditionAction);

		treeDraw.drawRoadConditionActions(nodeContent.filter(d => d.data.__typename === 'RoadConditionActionObjectType'))
	}

	/**
	 * Add node to local store if not yet selected, remove from local store if already selected.
	 * @param d
	 * @param element
	 */
	editNode(d: any, element: any) {
		selectAll(".node-content").filter(".highlight").attr("class", "node-content");
		if (this.state.curNodeId === d.data.id && this.state.curNodeType === d.data.__typename) {
			let data = {
				curNodeId: -1,
				curNodeType: null
			};
			this.setState(data);
			this.props.client.writeData({ data: data });
		} else {
			element.attr('class', 'node-content highlight');
			let data = {
				curNodeId: d.data.id,
				curNodeType: d.data.__typename
			};
			this.setState(data);
			this.props.client.writeData({ data: data });
		}
	}

	addNode(typename: string, parentInfo: [number, string]) {
		this.props.client.writeData({
			data: {
				curNodeId: -1,
				curNodeType: typename,
				parentInfo: parentInfo
			}
		});
	}

	hasChild(d: any, typeName: string) {
		if (d.children !== undefined) {
			for (let child of d.children) {
				if (child.data.__typename == typeName) {
					return true; // Check if it already has a child, since relation is 1..1 with Action
				}
			}
		}
		return false;
	}

	/*
		Show different types of nodes which can be added after current node
	 */
	addButtonFunctionality(item: any, that: Tree, d: any) {
		let options = [];
		switch (d.data.__typename) {
			case 'ScenarioObjectType':
				options = [{text: 'Add Segment', __typename: 'RoadSegmentObjectType'}];
				break;
			case 'RoadSegmentObjectType':
				options = [{text: 'Add Condition', __typename: 'RoadConditionObjectType'}];
				break;
			case 'RoadConditionObjectType':
				if (d.depth < 6) { // HARDCODED LIMIT TO DEPTH OF TREE
					options = [
						{text: 'Add Action', __typename: 'RoadConditionActionObjectType'}
					];
					if (!this.hasChild(d, 'RoadConditionObjectType')) {
						options.push({text: 'Add Condition', __typename: 'RoadConditionObjectType'});
					}
				} else if (d.depth >= 6) {
					options = [{text: 'Add Action', __typename: 'RoadConditionActionObjectType'}];
				}

				break;
			default:
				options = [{text: 'Geen optie', __typename: undefined}];
		}
		options.forEach(function (option, i) {
			let addButton = select(item).append('g').attr('class', 'add-button-' + i);

			if (option.__typename !== undefined) {
				addButton.on('click', function (d: any, i) {
					that.addNode(option.__typename, [d.data.id, d.data.__typename]);
				});
			}

			addButton
				.append('rect')
				.attr('class', 'add-button-rect-' + i + '-' + options.length);

			addButton
				.append('text').text(option.text)
				.attr('class', 'add-button-text-' + i);

		});
	}

	/**
	 * Check whether the array contains the clicked node. If not in, add. If already in, delete. The nodes
	 * in the array will be minimized;
	 * @param that
	 * @param d
	 */
	toggleVisibilityButtonFunctionality(that: Tree, d: any) {
		// Check if already in
		let alreadyIn = that.state.minimizedNodes.some((node) => (
			node.id === d.data.id && node.typename === d.data.__typename
		));

		if (alreadyIn) {
			// Remove from array
			that.setState({
				minimizedNodes: this.state.minimizedNodes.filter(node => {
					return node.id !== d.data.id || node.typename !== d.data.__typename
				})
			});
		} else {
			// Add to array
			that.setState({
				minimizedNodes: [...this.state.minimizedNodes, {typename: d.data.__typename, id: d.data.id}],
			});
		}
		this.setState({
			treeLevel: -1
		}, () => {
			select('svg').remove();
			that.createTree(this.getVisibleTree(), this.props.treeTransform);
		})
	}

	/*
		When the user has clicked on the delete button of a node. Delete the node and its children.
		The data as well as the visible data should be updated.
 	*/
	maximizeButtonFunctionality(that: Tree, d: any) {
		that.setState({
			minimizedNodes: this.state.minimizedNodes.filter(node => {
				return node.id !== d.data.id || node.typename !== d.data.__typename
			})
		});
		select('svg').remove();
		that.createTree(this.getVisibleTree(), this.props.treeTransform);
	}

	/*
		When the user has clicked on the hide button of a node, hide the node and its children.
		Only the visible data should be updated.
	 */
	hideButtonFunctionality(that: Tree, d: any) {
		that.setState({
			minimizedNodes: [...this.state.minimizedNodes, {typename: d.data.__typename, id: d.data.id}],
		});
		select('svg').remove();
		that.createTree(this.getVisibleTree(), this.props.treeTransform);
	}

	/*
		Building the object file starting from node. If node has the nodeId, do not add its children.
	 */
	minimizeChildren(nodeId: number, typeName: string, node: any): any {
		if (nodeId === node.id && node.__typename === typeName) {
			return {...node, children: []}
		} else if (node.hasOwnProperty('children')) {
			let children = [];
			for (let index = 0; index < node.children.length; index++) {
				children[index] = this.minimizeChildren(nodeId, typeName, node.children[index])
			}
			return {...node, children: children}
		} else return node;
	}

	minimizeChildrenLevel(scenario: any, level: number) {
		let q = [scenario];
		let minimized = [];
		while (q.length > 0) {
			let node = q.shift()
			if (node.depth < level) {
				let children = node.children;
				for (let c in children) {
					q.push(children[c]);
				}
			} else {
				minimized = [...minimized, {typename: node.data.__typename, id: node.data.id}]
			}

		}
		return minimized;
	}

	/*
		Building the object file when maximize
	 */
	addChildren(nodeId: number, typeName: string, visibleTree: any, ogTree: any): any {

		if ((nodeId !== visibleTree.id || visibleTree.__typename !== typeName) && visibleTree.hasOwnProperty('children')) {
			let visibleTreeChildren = [];
			for (let index = 0; index < visibleTree.children.length; index++) {
				for (let ogIndex = 0; ogIndex < ogTree.children.length; ogIndex++) {
					if (visibleTree.children[index].id === ogTree.children[ogIndex].id) {
						visibleTreeChildren[index] = this.addChildren(nodeId, typeName, visibleTree.children[index], ogTree.children[ogIndex]);
					}
				}
			}
			return {...visibleTree, children: visibleTreeChildren}
		} else {
			if (ogTree.hasOwnProperty('children')) {
				return {...visibleTree, children: ogTree.children}
			} else {
				return visibleTree;
			}
		}
	}

	updateMinimizedNodes() {
		const hierarchyData = hierarchy(this.props.scenario).sum(function (d) {
			return d.value
		});
		this.setState({
			minimizedNodes:
				this.minimizeChildrenLevel(hierarchyData, this.state.treeLevel)
		}, () => {
			select('svg').remove();
			this.createTree(this.getVisibleTree(), this.props.treeTransform);
		})
	}

	handleLevel(newLevel: number) {
		this.setState({
			treeLevel: newLevel
		}, () => {
			this.updateMinimizedNodes()
		});
	}

	render() {
		return (
			<div className="tree">
				<div ref={this.chartRef} className="treeLayout">
				</div>
			</div>
		);
	}
}

const Small = asSmallWorkspace(
	Tree
);

const Large = asLargeWorkspace(
	Tree
);

export default {Small, Large};
