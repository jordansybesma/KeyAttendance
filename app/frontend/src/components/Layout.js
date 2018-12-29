import React, { Component } from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import AuthService from './AuthService';

class Layout extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activeItem: 'home'
    };
    this.handleLogout = this.handleLogout.bind(this);
    this.Auth = new AuthService();
  }

  handleItemClick = (name) => () => {
    this.props.history.push(`/${name}`);
  }

  handleLogout(){
    this.Auth.logout()
    this.props.history.replace('/');
 }

  render() {
    let nav;
    if (this.props.user.is_staff) {
      nav = <Nav>
        <NavItem onClick={this.handleItemClick('attendance')}>Attendance</NavItem>
        <NavItem onClick={this.handleItemClick('students')}>Students</NavItem>
        <NavItem onClick={this.handleItemClick('reports')}>Reports</NavItem>
        <NavItem onClick={this.handleItemClick('alerts')}>Alerts</NavItem>
        <NavItem onClick={this.handleItemClick('admin')}>Admin</NavItem>
      </Nav>
    } else {
      nav = <Nav>
        <NavItem onClick={this.handleItemClick('attendance')}>Attendance</NavItem>
        <NavItem onClick={this.handleItemClick('students')}>Students</NavItem>
      </Nav>
    }
    return (
      <div>
        <Navbar>
            <Navbar.Header>
                <Navbar.Brand onClick={this.handleItemClick('attendance')}>
                    Key
                </Navbar.Brand>
                <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
            {nav}
            <Nav pullRight>
              <NavItem>Hello, {this.props.user.username}</NavItem>
              <NavItem onClick={this.handleLogout}>Logout</NavItem>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        {this.props.children}
      </div>
    );
  }
}

Layout.propTypes = {
  history: PropTypes.shape({
      push: PropTypes.func.isRequired,
  }),
};

export default withRouter(Layout);
