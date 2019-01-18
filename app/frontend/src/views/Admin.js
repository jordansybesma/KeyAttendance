import React from 'react';
import { Redirect } from 'react-router-dom';
import AdminTabs from '../components/AdminTabs';

class Admin extends React.Component {

    render() {
        if (window.localStorage.getItem("isAdmin") === "true") {
            return (
                <div className='content'>
                    <AdminTabs />
                </div>
            );
        } else {
            return (<Redirect to='/attendance'/>);
        }
    }
}

export default Admin;