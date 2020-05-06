import React from "react";
import {RaisedButton,TextField, AppBar, MuiThemeProvider} from 'material-ui';


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
                        <br/>
                        <TextField
                            type={"password"}
                            floatingLabelText={"Password"}
                            onChange= {(click,newVal) => this.setState({password:newVal})}
                        />
                        <br/>
                        <RaisedButton
                            label = "Login"
                            style={style}
                            onClick={(click) => this.handleClick(click)} //handleClick function needs to be written to send authentication info to backend
                        />
                    </div>
                </MuiThemeProvider>
            </div>
        );
    }
    handleClick(click) {

    }
}



export default Login;
