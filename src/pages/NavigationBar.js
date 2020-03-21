/** @jsx jsx */

import React, { Component } from 'react';
import { jsx } from '@emotion/core';
import { withRouter } from 'react-router-dom';

import Navbar from '../components/Navbar';
import Navigation from '../components/Navigation';

class NavigationBar extends Component {
  render() {
    var links = [
      {
        to: '/',
        text: 'Home',
      },
      {
        to: '/overview',
        text: 'Overview',
      },
      {
        to: '/simulate',
        text: 'Simulate',
      },
      {
        to: '/methods',
        text: 'Methods',
      },
      {
        to: '/about',
        text: 'About',
      },
    ];

    const { location } = this.props;

    return <Navigation links={links} pathname={location.pathname} />;
  }
}

export default withRouter(NavigationBar);
