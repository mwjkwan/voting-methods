/** @jsx jsx */

import { Component } from "react";
import { jsx } from "@emotion/core";
import { withRouter } from "react-router-dom";
import Navigation from "../components/Navigation";

class NavigationBar extends Component {
  render() {
    var links = [
      {
        to: "/",
        text: "Home"
      },
      {
        to: "/overview",
        text: "Overview"
      },
      {
        to: "/distribution",
        text: "Distributions"
      },
      {
        to: "/simulate",
        text: "Simulate"
      },
      {
        to: "/methods",
        text: "Methods"
      },
      {
        to: "/about",
        text: "About"
      }
    ];

    const { location } = this.props;
    return <Navigation links={links} pathname={location.pathname} />;
  }
}

export default withRouter(NavigationBar);
