import React from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import Users from './Users';
import Roles from './Roles';

class AdminTabs extends React.Component {
    constructor(props, context) {
      super(props, context);
  
      this.handleSelect = this.handleSelect.bind(this);
  
      this.state = {
        key: 1
      };
    }
  
    handleSelect(key) {
      this.setState({ key });
    }
  
    render() {
      return (
        <Tabs
          activeKey={this.state.key}
          onSelect={this.handleSelect}
          id="admin-tabs"
        >
          <Tab eventKey={1} title="User Management">
            <Users/>
          </Tab>
          <Tab eventKey={2} title="User Roles">
            <Roles/>
          </Tab>
          <Tab eventKey={3} title="Attendance Columns">
            Tab 3 content
          </Tab>
          <Tab eventKey={4} title="Profile Data">
            Tab 4 content
          </Tab>
        </Tabs>
      );
    }
  }
  
export default AdminTabs;