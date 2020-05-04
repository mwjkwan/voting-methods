/** @jsx jsx */

import { Component } from "react";
import { css, jsx } from "@emotion/core";

import Description from "../components/Description";
import Article from "../components/Article";

import SimMap from "../viz/SimMap";
import SimDots from "../viz/SimDots";
import SimLine from "../viz/SimLine";
import SimBar from "../viz/SimBar";

const aboutProject = (
  <div>
    Here, we simulate the outcomes of RCV elections as if they were FPTP.
  </div>
);

const content = {
  header: "Simulate"
};

const aboutStyle = css`
  div {
    font-size: 18px !important;
  }
`;

export default class PageSimulate extends Component {
  render() {
    return (
      <Article {...content}>
        <div css={aboutStyle}>
          <Description>{aboutProject}</Description>
        </div>
        <SimMap/>
        <SimLine/>
        <SimDots/>
        <SimBar/>
      </Article>
    );
  }
}
