import * as React from "react";
import { Mutation } from 'react-apollo'
import gql from "graphql-tag";
import { useHistory } from "react-router-dom";

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
}

interface Props { }

class Login extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = { username: '', password: '' };
    }

    toHome() {
        let path = `/`;
        let history = useHistory();
        history.push(path);
    };

    render() {
        const { username, password } = this.state;

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
                                            document.cookie = 'token=' + res.data.tokenAuth.token;
                                            window.location.href = window.location.origin;
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
