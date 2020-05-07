import * as React from "react";
import { Mutation, ApolloConsumer } from 'react-apollo'
import gql from "graphql-tag";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";

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
        this.state = {
            username: '',
            password: ''
        }
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
                                    <Card style={{width: 400}}>
                                        <CardHeader title={'Login'} style={{textAlign: 'center',background: '#212121', color: '#fff'}}/>
                                        <CardContent>
                                            <div>
                                                <TextField
                                                    fullWidth
                                                    label = "Username"
                                                    type = "text"
                                                    value={username}
                                                    onChange={
                                                        (event) => {
                                                            // TODO Validate stuff
                                                            this.setState({ username: event.target.value })
                                                        }
                                                    }
                                                />
                                                <br/>
                                                <TextField
                                                    fullWidth
                                                    label = "Password"
                                                    type="password"
                                                    value={password}
                                                    onChange={
                                                        (event) => {
                                                            // TODO Validate stuff
                                                            this.setState({ password: event.target.value })
                                                        }
                                                    }
                                                />
                                            </div>
                                        </CardContent>
                                        <CardActions>
                                            <Button
                                                variant= "contained"
                                                size= "large"
                                                color= "primary"
                                                style={{alignItems: 'center'}}
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
                                            > Login </Button>
                                        </CardActions>
                                    </Card>
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
