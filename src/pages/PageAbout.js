/** @jsx jsx */

import { Component } from "react";
import { css, jsx } from "@emotion/core";

import Description from "../components/Description";
import Article from "../components/Article";

const aboutProject = (
  <div>
    This will include information about our project, the team members, and the
    sources.
  </div>
);

const content = {
  header: "About"
};

const aboutStyle = css`
  div {
    font-size: 18px !important;
  }
`;

export default class PageAbout extends Component {
  render() {
    return (
      <Article {...content}>
        <div css={aboutStyle}>
          <Description>{aboutProject}</Description>
        </div>
      </Article>
    );
  }
}
