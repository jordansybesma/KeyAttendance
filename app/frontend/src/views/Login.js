import React from 'react';
import { Redirect } from 'react-router-dom';

class Login extends React.Component {
        
    render() {
        return (
            // TODO: Implement.
            // But for now, let's just load the attendance page.
            <Redirect to='/attendance'/>
        );
    }
}

export default Login;