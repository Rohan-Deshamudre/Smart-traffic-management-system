import * as React from "react";
import { Mutation, ApolloConsumer } from 'react-apollo'
import gql from "graphql-tag";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import { Grid } from "@material-ui/core";
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
                            <Grid
                                container
                                spacing={0}
                                direction="column"
                                alignItems="center"
                                justify="center"
                                style={{ minHeight: '100vh' }}
                            ><Grid item xs={3}>
                                    <Card style={{ width: 400 }}>
                                        <CardHeader title={'Login'} style={{ textAlign: 'center', background: '#212121', color: '#fff' }} />
                                        <CardContent>
                                            <div>
                                                <TextField
                                                    fullWidth
                                                    label="Username"
                                                    type="text"
                                                    value={username}
                                                    onChange={
                                                        (event) => {
                                                            // TODO Validate stuff
                                                            this.setState({ username: event.target.value })
                                                        }
                                                    }
                                                />
                                                <br />
                                                <TextField
                                                    fullWidth
                                                    label="Password"
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
                                        <CardActions style={{ justifyContent: 'center' }}>
                                            <Button
                                                variant="contained"
                                                size="large"
                                                color="primary"
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
                                                                Auth.login(res.data.tokenAuth.token)
                                                                this.setState(() => ({
                                                                    valid: true
                                                                }))
                                                            }
                                                        });
                                                        this.setState({ username: '', password: '' })
                                                    }
                                                }
                                            > Login </Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            </Grid>
                        </div>
                    )}
                </Mutation>
            </div>
        );
    }
}

export default Login;
