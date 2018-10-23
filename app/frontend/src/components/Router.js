import React from 'react';
import { Route, Switch } from 'react-router';
import Login from '../views/Login';
import Attendance from '../views/Attendance';
import Students from '../views/Students';
import Reports from '../views/Reports';
import Admin from '../views/Admin';
import Alerts from '../views/Alerts';
import NotFound from '../views/NotFound';

class Router extends React.Component {
    render() {
        return (
            <Switch>
                <Route exact path='/' component={Login}/>
                <Route exact path='/attendance' component={Attendance}/>
                <Route path='/students' component={Students}/>
                <Route path='/reports' component={Reports}/>
                <Route path='/admin' component={Admin}/>
                <Route path='/alerts' component={Alerts}/>
                <Route component={NotFound}/>
            </Switch>
        );
    }
}

export default Router;