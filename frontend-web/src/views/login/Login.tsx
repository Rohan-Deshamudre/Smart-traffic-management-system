import * as React from "react";
import { Mutation, ApolloConsumer } from 'react-apollo'
import gql from "graphql-tag";

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

interface Props {
    loginCallback: Function
}

class Login extends React.Component<Props, State> {


    constructor(props: Props) {
        super(props);

        this.state = { username: '', password: '' };
    }



    render() {
        const { username, password } = this.state;

        return (
            <div className="view login-view">
                <ApolloConsumer>
                    {client => (
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
                                                        // TODO: go to map
                                                        window.location.reload()
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
                    )}
                </ApolloConsumer>
            </div>
        );
    }
}

export default Login;
