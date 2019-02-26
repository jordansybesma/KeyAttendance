import React from 'react';
import { Redirect } from 'react-router-dom';
import AdminTabs from '../components/AdminTabs';
import { getPermissions } from '../components/Helpers';

class Admin extends React.Component {

    render() {
        const permissions = getPermissions();
        if (permissions.indexOf('view_user') >= 0 || permissions.indexOf('view_group') >= 0) {
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