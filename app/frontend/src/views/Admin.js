import React from 'react';
import Users from './Users'

class Admin extends React.Component {

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