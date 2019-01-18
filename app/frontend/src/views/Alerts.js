import React from 'react';
import { Redirect } from 'react-router-dom';

class Alerts extends React.Component {
    render() {
        console.log()
        if (window.localStorage.getItem("isAdmin") === "true") {
            return (
                <div className='content'>
                    <p>Alerts</p>
                </div>
            );
        } else {
            return (<Redirect to='/attendance'/>);
        }
    }
}

export default Alerts;