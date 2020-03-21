import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { NavLink as RRNavLink } from 'react-router-dom';
import { NavLink } from 'reactstrap';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { BrowserRouter as Router } from 'react-router-dom';

class Navigation extends Component {
  renderLink(link, path) {
    const highlight = link.to !== '/' ? path.includes(link.to) : path === '/';
    return (
      <div key={link.text} className={'link' + (highlight ? ' Highlight' : '')}>
        <NavLink tag={RRNavLink} exact to={link.to} activeClassName="active">{link.text}</NavLink>
      </div>
    );
  };

  renderLinks() {
    const { links, pathname } = this.props;

    const parts = pathname.split('/');
    const path = '/' + parts[1] + (parts[2] ? '/' + parts[2] : '');

    return (
      <div className="links">
        {links.map(link => {
          return this.renderLink(link, path);
        })}
      </div>
    );
  }

  render() {
    return(
      <div>
        <Router>
          <Navbar bg="light" expand="lg">
            <Navbar.Brand href="/">Voting Methods</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                {this.renderLinks()}
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </Router>
      </div>
    );
  }
}

export default withRouter(Navigation);;