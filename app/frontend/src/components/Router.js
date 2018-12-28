import React from 'react';
import { Route, Switch } from 'react-router';
import Login from '../views/Login';
import Home from '../views/Home';

class Router extends React.Component {
    render() {
        return (
            <Switch>
                <Route exact path='/' component={Login} />
                <Route component={Home}/>
            </Switch>
        );
    }
}

export default Router;