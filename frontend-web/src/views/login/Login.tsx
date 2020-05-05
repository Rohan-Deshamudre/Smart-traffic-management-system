import * as React from "react";
import gql from "graphql-tag";

const LOGIN = gql`
    mutation tokenAuth($username: String!, $password: String!) {
            token
    }
`;

interface State {
    username: String,
    password: String
}

interface Props { }

class Login extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.setState({username: '', password: ''})
    }

    setUsername(username: String): void {
        const password = this.state.password;
        this.setState({username, password})
    }

    setPassword(password: String): void {
        const username = this.state.username;
        this.setState({username, password})
    }

    render() {
        return (
            <div className="view login-view">

                <form>
                    <p>Username: <input type="text" onChange={event => this.setUsername(event.target.value)} /></p>
                    <p>Password: <input type="password" onChange={event => this.setPassword(event.target.value)} /></p>
                    <p><button type="submit">Login</button></p>
                </form>

            </div>
        );
    }
}

export default Login;
