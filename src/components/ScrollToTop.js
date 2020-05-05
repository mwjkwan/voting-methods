/** @jsx jsx */

import { Component } from "react";
import { css, jsx } from "@emotion/core";

const descriptionStyle = css`
  .description {
    max-width: 50em !important;
    margin-left: 0em;
  }
`;

export default class ScrollToTop extends Component {
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0)
    }
  }

  render() {
    return this.props.children
  }
}
