import React from 'react';
import AuthService from '../components/AuthService';

class Users extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            is_staff: false
          };
        this.handleCreate = this.handleCreate.bind(this);
        this.Auth = new AuthService();
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

    handleCheckClick = () => {
        this.setState({ is_staff: !this.state.is_staff });
    }

    handleCreate = (e) => {
        e.preventDefault();
        this.Auth.fetch('http://127.0.0.1:8000/api/users/', 'POST', { body: JSON.stringify(this.state) })
            .catch(err => {
                alert("Failed to create new account. Please try again.");
            });
        this.setState({
            username: '',
            password: '',
            is_staff: false
        });
    }

    render() {
        return (
            <div className='content'>
                <form onSubmit={e => this.handleCreate(e)}>
                <h2>Create New Account</h2>
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
                <label>Is Admin</label>
                <input
                    type="checkbox"
                    name="is_staff"
                    value={this.state.is_staff}
                    onChange={this.handleCheckClick}
                />
                <input type="submit" />
            </form>
            </div>
        );
    }
}

export default Users;