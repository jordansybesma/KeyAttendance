import React, { Component } from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

class Layout extends Component {

  constructor(props) {
    super(props);
    this.state ={
        activeItem: 'home'
      }
  }

  handleItemClick = (name) => () => {
    this.props.history.push(`/${name}`);
  }

  render() {
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
              <Nav>
                  <NavItem onClick={this.handleItemClick('attendance')}>Attendance</NavItem>
                  <NavItem onClick={this.handleItemClick('students')}>Students</NavItem>
                  <NavItem onClick={this.handleItemClick('reports')}>Reports</NavItem>
                  <NavItem onClick={this.handleItemClick('alerts')}>Alerts</NavItem>
                  <NavItem onClick={this.handleItemClick('admin')}>Admin</NavItem>
              </Nav>
              <Nav pullRight>
                <NavItem>Logout</NavItem>
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
