import React from 'react';
import { Redirect } from 'react-router-dom';

class Reports extends React.Component {
    render() {
        if (window.localStorage.getItem("isAdmin") === "true") {
            return (
                <div className='content'>
                    <p>Reports</p>
                </div>
            );
        } else {
            return (<Redirect to='/attendance'/>);
        }
    }
}

export default Reports;