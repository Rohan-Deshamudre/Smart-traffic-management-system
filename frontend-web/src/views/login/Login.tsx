import * as React from "react";
import { Mutation, ApolloConsumer } from 'react-apollo'
import gql from "graphql-tag";
import { Auth } from '../../helper/auth';
import { Redirect } from "react-router-dom";

const LOGIN = gql`
    mutation PostMutation($username: String!, $password: String!) {
        tokenAuth(username: $username, password: $password) {
            token
        }
    }
`;

interface State {
    password: string,
    username: string,
    valid: boolean,
}

interface Props {
}

class Login extends React.Component<Props, State> {


    constructor(props: Props) {
        super(props);

        this.state = { username: '', password: '', valid: false };
    }



    render() {
        const { username, password, valid } = this.state;

        if (valid === true) {
            return <Redirect to='/' />
        }

        return (
            <div className="view login-view">
                <Mutation mutation={LOGIN} >

                    {(login) => (
                        <div>

                            <p>Username:
                                <input
                                    type="text"
                                    value={username}
                                    onChange={
                                        (event) => {
                                            // TODO Validate stuff
                                            this.setState({ username: event.target.value })
                                        }
                                    }
                                />
                            </p>

                            <p>Password:
                                <input
                                    type="password"
                                    value={password}
                                    onChange={
                                        (event) => {
                                            // TODO Validate stuff
                                            this.setState({ password: event.target.value })
                                        }
                                    }
                                />
                            </p>

                            <button
                                onClick={
                                    (event) => {
                                        event.preventDefault();
                                        login({
                                            variables: {
                                                username,
                                                password
                                            }
                                        }).then((res) => {
                                            if (res.data.tokenAuth.token) {
                                                Auth.login(res.data.tokenAuth.token)
                                                this.setState(() => ({
                                                    valid: true
                                                }))
                                            }
                                        });
                                        this.setState({ username: '', password: '' })
                                    }
                                }
                                title="login"
                            />
                        </div>
                    )}

                </Mutation>
            </div>
        );
    }
}

export default Login;
