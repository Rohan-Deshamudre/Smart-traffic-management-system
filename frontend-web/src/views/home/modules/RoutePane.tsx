import * as React from "react";
import asRoutesPane from "../../../components/RoutePane";
import RouteToolbox from "../../scenario-designer/toolboxes/RouteToolbox";
import {Mutation, Query, ApolloConsumer} from 'react-apollo';
import Button from "react-bootstrap/Button";
import Name from "../../../components/other/Name";

type Props = {
    id?: number,
	data?: any,
	handleData?: (newData: any) => void,
	readOnly?: boolean
}

type State = {
    name: string,
    route?: { id: number, lng: number, lat: number }[],
    saved: boolean,
	disabled: boolean
}

class RoutePane extends React.Component<Props, State, any> {
    baseState: State = {
        name: '',
        route: [],
        saved: true,
		disabled: true
    }

    constructor(props: Props) {
        super(props);
        this.state = this.baseState;

        if (this.props.data !== undefined) {
			let {data} = this.props;
			this.state = {
				...this.state,
				name: data.roadSegments[0].name,
				route: data.roadSegments[0].route.routePoints,
			}
        }
        
        this.handleName = this.handleName.bind(this);
		this.handleData = this.handleData.bind(this);
        this.handleRoute = this.handleRoute.bind(this);
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
			route: this.state.route.map(route => ({lng: route.lng, lat: route.lat})),
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
    
    disabled() {
		this.setState({
			disabled: (
				this.state.name === ""
				|| this.state.route === undefined
			)
		});
	}

    render() {
        const disabled = this.state.disabled ? ' disabled' : '';
        const success = this.state.saved ? ' btn-success' : '';
        
        return (
            <div className="pane left-pane designer">
                <div className="pane-header">
                    <div className="d-block header-title">Plan your route:</div>
                </div>
                <br/>
                <div className="mid">
                    <Name name={this.state.name} handleName={this.handleName} disabled={this.props.readOnly} />
                    <ApolloConsumer>
                        {
                            client => (
                                <RouteToolbox route={this.state.route} 
                                            client={client} 
                                            disabled={this.props.readOnly} 
                                            handleRoute={this.handleRoute} />
                            )
                        }
                    </ApolloConsumer>
                </div>
            </div>
        );
    }

}

export default asRoutesPane(RoutePane)
