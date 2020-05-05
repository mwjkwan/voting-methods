import React, { Component } from "react";
import { withRouter } from "react-router";
import { NavLink as RRNavLink } from "react-router-dom";
import { NavLink } from "reactstrap";
import { Navbar, Nav } from "react-bootstrap";

class Navigation extends Component {
  renderLink(link, path) {
    const highlight = link.to !== "/" ? path.includes(link.to) : path === "/";
    return (
      <NavLink style={{color: '#ffffff'}}
        className={"link" + (highlight ? " Highlight" : "")}
        tag={RRNavLink}
        exact
        to={link.to}
        activeClassName="active"
      >
        {link.text}
      </NavLink>
    );
  }

  renderLinks() {
    const { links, pathname } = this.props;

    const parts = pathname.split("/");
    const path = "/" + parts[1] + (parts[2] ? "/" + parts[2] : "");

    return (
      <div className="links">
        {links.map(link => {
          return this.renderLink(link, path);
        })}
      </div>
    );
  }

  render() {
    const { links, pathname } = this.props;

    const parts = pathname.split("/");
    const path = "/" + parts[1] + (parts[2] ? "/" + parts[2] : "");

    return (
      <div>
        <Navbar style={{backgroundColor: '#34495D'}} fixed="top" expand="lg">
          <Navbar.Brand style={{color: '#ffffff'}} href="/">Voting Methods Project</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              {links.map(link => {
                return this.renderLink(link, path);
              })}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        {this.props.children}
      </div>
    );
  }
}

export default withRouter(Navigation);
