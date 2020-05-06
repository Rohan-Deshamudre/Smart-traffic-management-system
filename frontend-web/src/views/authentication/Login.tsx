import { Component } from 'react'
import * as React from "react"
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";


interface State {
    password: string,
    username: string
}
interface Props { }


class Login extends Component<Props,State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        }
    }

    render() {
        return(
            <form>
                <Card>
                    <CardHeader title={'Login'}/>
                    <CardContent>
                        <div>
                            <TextField
                                fullWidth
                                type={"username"}
                                label = "Username"
                                onChange={event => this.setState({ username: event.target.value })}
                            />
                            <br/>
                            <TextField
                                fullWidth
                                type={"password"}
                                label = "Password"
                                onChange={event => this.setState({ password: event.target.value })}
                            />
                        </div>
                    </CardContent>
                    <CardActions>
                        <Button
                            variant= "contained"
                            size= "large"
                            color= "primary"
                        > Login </Button>
                    </CardActions>
                </Card>
            </form>
        );
    }
}

export default Login;
