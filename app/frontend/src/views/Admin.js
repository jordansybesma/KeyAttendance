import React from 'react';
import Users from './Users'

class Admin extends React.Component {

    componentWillMount() {
        if (!this.props.user.is_staff) {
            this.props.history.replace('/attendance');
        }
    }

    render() {
        return (
            <div className='content'>
                <p>Admin</p>
                <Users/>
            </div>
        );
    }
}

export default Admin;