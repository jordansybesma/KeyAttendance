import React from 'react';
import { Route, Switch } from 'react-router';
import Attendance from '../views/Attendance';
import Students from '../views/Students';
import Reports from '../views/Reports';
import Admin from '../views/Admin';
import Alerts from '../views/Alerts';
import NotFound from '../views/NotFound';
import Layout from '../components/Layout';
import withAuth from '../components/withAuth';

class Home extends React.Component {

    render() {
        return (
            <Layout user={this.props.user}>
                <Switch>
                    <Route exact path='/attendance' component={Attendance} />
                    <Route path='/students' component={(props) => <Students />} />}/> {/* Referencing the component this way causes a re-mount every time the NavBar button is clicked, which solves our problem of refreshing the page but costs some performance in teh frontend and calls to the database */}
                    <Route path='/reports' component={Reports} />
                    <Route path='/admin' component={Admin} />
                    <Route path='/alerts' component={Alerts} />
                    <Route component={NotFound} />
                </Switch>
            </Layout>
        );
    }
}

export default withAuth(Home);