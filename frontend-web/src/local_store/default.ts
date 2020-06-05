import { schema } from "./schema";

export const defaultStore = {
	mapLocation: '',
	longitude: 0,
	latitude: 0,
	boundingBox: [],

	currentTreeId: null,
	curNodeId: -1,
	curNodeType: null,

	parentInfo: [-1, ''],
	treeIsUpToDate: false,

	// Navbar data
	workspaceSwapped: true,
	treeHeight: 0,
	treeLevel: -1,

	currDripId: -1,
	instrumentActionRoutes: [],
	selectedInstrumentActionRoutes: [],
	selectedRoute: [],
	alternativeRoute: [],
	visibleInstruments: [],

	treeTransform: [0.5, 200, 100],
	simulationScene: null,
	simulating: false,
	appData: [{
		__typename: "ApplicationData",
		mapFocusPoint: {
			__typename: "Coordinates",
			lng: 4.362725,
			lat: 51.999457,
			zoom: 15
		}
	}],
};


