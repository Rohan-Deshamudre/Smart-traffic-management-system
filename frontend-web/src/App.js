import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react';

import { history } from "./helper/history";
import { Router, Route, Switch } from "react-router-dom"

import ScenarioDesigner from "./views/scenario-designer/ScenarioDesigner";
import ScenarioSimulator from "./views/scenario-simulator/ScenarioSimulator";
import Home from "./views/home/Home";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import Login from "./views/login/Login";
import { Redirect } from 'react-router-dom'

import { Auth } from './helper/auth';


class App extends Component {

    render() {
        return (
            <Router history={history}>
                <Query query={gql`{currentTreeId @client}`}>
                    {({ data }) => {
                        // TODO: go to home ipv login
                        console.log("whahaha")

                        if (data.currentTreeId === null) {
                            return (
                                <Switch>
                                    <Route path="/login" component={Login} />
                                    <Home />
                                </Switch>
                            )
                        } else {
                            return (
                                <Switch>
                                    <Route path="/designer" component={ScenarioDesigner} />
                                    <Route path="/simulator" component={ScenarioSimulator} />
                                    <Route path="/" component={Home} />
                                    <Route path="/login" component={Login} />
                                </Switch>
                            )
                        }
                    }}
                </Query>
            </Router>
        );
    }
}

export default App;
