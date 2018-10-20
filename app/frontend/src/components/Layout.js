import React, { Component } from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';

class Layout extends Component {

  render() {
    return (
      <div>
        <Navbar>
            <Navbar.Header>
                <Navbar.Brand>
                    Key
                </Navbar.Brand>
            </Navbar.Header>
            <Nav>
                <NavItem>Attendance</NavItem>
                <NavItem>Students</NavItem>
                <NavItem>Reports</NavItem>
                <NavItem>Alerts</NavItem>
                <NavItem>Admin</NavItem>
            </Nav>
        </Navbar>
        {this.props.children}
      </div>
    );
  }
}

export default Layout;
