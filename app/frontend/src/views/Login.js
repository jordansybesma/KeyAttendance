import React from 'react';
import AuthService from '../components/AuthService'

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
          };
        this.handleLogin = this.handleLogin.bind(this);
        this.Auth = new AuthService();
      }

    componentWillMount(){
        if(this.Auth.loggedIn())
            this.props.history.replace('/attendance');
    }

    handleChange = e => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState(prevstate => {
            const newState = { ...prevstate };
            newState[name] = value;
            return newState;
        });
    };

    handleLogin = (e) => {
        e.preventDefault();
        this.Auth.login(this.state.username, this.state.password)
            .then(res => {
                this.props.history.replace('/attendance');
            })
            .catch(err => {
                alert("Login failed. Please try again.");
            })
        this.setState({
            username: '',
            password: ''
        });
    }

    render() {
        return (
            <form onSubmit={e => this.handleLogin(e)}>
                <h2>Log In</h2>
                <label>Username</label>
                <input
                    type="text"
                    name="username"
                    value={this.state.username}
                    onChange={this.handleChange}
                />
                <label>Password</label>
                <input
                    type="password"
                    name="password"
                    value={this.state.password}
                    onChange={this.handleChange}
                />
                <input type="submit" />
            </form>
        );
    }
}

export default Login;