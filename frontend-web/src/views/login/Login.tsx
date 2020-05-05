import * as React from "react";
import gql from "graphql-tag";
import ApolloClient from 'apollo-boost';
import { CREATE_FOLDER } from "../../components/CRUDFolders";

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

        this.state = { username: '', password: '' };

        this.setUsername = this.setUsername.bind(this);
        this.setPassword = this.setPassword.bind(this);
        this.getUsername = this.getUsername.bind(this);
        this.getPassword = this.getPassword.bind(this);
        this.login = this.login.bind(this);
    }

    setUsername(username: String): void {
        const password = this.state.password;
        this.setState({ username, password })
    }

    setPassword(password: String): void {
        const username = this.state.username;
        this.setState({ username, password })
    }

    getUsername() {
        return this.state.username;
    }

    getPassword() {
        return this.state.password;
    }

    login(event, username: String, password: String) {
        event.preventDefault();

        const client = new ApolloClient({
            uri: 'http://127.0.0.1:8000/graphql/',
        });

        client
            .mutate({ mutation: LOGIN, variables: { username, password } })
            .then(result => console.log(result));

        // return (
        //     <Query query={LOGIN} variables={{username, password}}>
        //         {({loading, error, data, client}) => {
        //
        //             console.log('henk');
        //             console.log(password);
        //
        //             if (loading) return <div>Fetching</div>;
        //             if (error) return <div>Error</div>;
        //
        //             document.cookie = 'token=' + data.token;
        //         }}
        //     </Query>
        // );
    }

    render() {
        return (
            <div className="view login-view">

                <form onSubmit={(event) => this.login(event, this.getUsername(), this.getPassword())}>
                    <p>Username: <input type="text" onChange={(event) => this.setUsername(event.target.value)} /></p>
                    <p>Password: <input type="password" onChange={(event) => this.setPassword(event.target.value)} /></p>
                    <p><button type="submit">Login</button></p>
                </form>

            </div>
        );
    }
}

export default Login;
