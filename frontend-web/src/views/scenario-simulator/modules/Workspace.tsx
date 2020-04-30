import * as React from 'react';
import asWorkspace from "../../../components/Workspace";
import * as _ from 'lodash';


interface simulationSceneEvent {
	simulationId: number;
	roadSegment: { id: number }
	roadConditionTypeId: { id: number }
	value: number
}

interface simulationScene {
	id: number;
	time: string;
	simulationSceneEvents: simulationSceneEvent[]
}


interface State {
	simulationStatus: simulationScene;
}

interface Props {
	simulationStatus: any
	client: any
}

class Workspace extends React.Component<Props, State, any> {
	constructor(props: Props) {
		super(props);
		this.state = {
			simulationStatus: this.props.simulationStatus,
		};

	}

	componentDidUpdate(oldProps) {
		const newProps = this.props;

		if (!_.isEqual(oldProps.simulationStatus, newProps.simulationStatus)) {

			this.setState({
				simulationStatus: newProps.simulationStatus
			});

			this.props.client.writeData({data: {simulationScene: _.cloneDeep(newProps.simulationStatus)}});
		}
	}

	render() {
		return null;
	}
}

export default asWorkspace(Workspace);
