import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { NavLink as RRNavLink } from 'react-router-dom';
import { NavLink } from 'reactstrap';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { BrowserRouter as Router } from 'react-router-dom';

class Navigation extends Component {
  render() {
    return(
      <div>
        <Router>
          <Navbar bg="light" expand="lg">
            <Navbar.Brand href="#home">Voting Methods</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <NavLink tag={RRNavLink} exact to="/" activeClassName="active">Home</NavLink>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </Router>
      </div>
    );
  }
}

export default withRouter(Navigation);;