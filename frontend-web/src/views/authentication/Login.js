import React from "react";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        }
    }

    render() {
        return (
            <div>
                <MuiThemeProvider>
                    <div>
                        <AppBar title={"Login"} />
                        <TextField
                            type={"username"}
                            floatingLabelText={"Username"}
                            onChange = {(click,newVal) => this.setState({username:newVal})}
                        />
                        <TextField
                            type={"password"}
                            floatingLabelText={"Password"}
                            onChange= {(click,newVal) => this.setState({password:newVal})}
                        />
                        <RaisedButton
                            label = {"Login"}
                            onClick={(click) => this.handleClick(click)} //handleClick function needs to be written to send authentication info to backend
                        />
                    </div>
                </MuiThemeProvider>
            </div>
        );
    }
}

