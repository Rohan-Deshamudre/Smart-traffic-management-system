import { Component } from 'react'
import * as React from "react";
import { Mutation } from 'react-apollo'
import gql from "graphql-tag";
import ApolloClient from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks'
import { CREATE_FOLDER } from "../../components/CRUDFolders";

const LOGIN = gql`
    mutation PostMutation($username: String!, $password: String!) {
        tokenAuth(username: $username, password: $password) {
            token
        }
    }
`;

interface State {
    password: string,
    username: string
}

interface Props { }

class Login extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = { username: '', password: '' };
    }

    render() {
        const { username, password } = this.state;
        var rest;
        return (
            <div className="view login-view">

                <Mutation mutation={LOGIN} >
                    {(login) => (
                        <div>
                            <p>Username: <input type="text" value={username} onChange={e => this.setState({ username: e.target.value })} /></p>
                            <p>Password: <input type="password" value={password} onChange={e => this.setState({ password: e.target.value })} /></p>
                            <button onClick={() => {
                                login({
                                    variables: {
                                        username,
                                        password
                                    }
                                })
                                    .then((res) => {
                                        console.log(res)
                                    })
                                this.setState({ username: '', password: '' })
                            }}
                                title="login"
                            />
                        </div>
                    )}
                </Mutation>

            </div >
        );
    }
}

export default Login;
