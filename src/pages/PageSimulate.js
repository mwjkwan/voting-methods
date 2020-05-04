/** @jsx jsx */

import { Component } from "react";
import { css, jsx } from "@emotion/core";

import Description from "../components/Description";
import Article from "../components/Article";
import Distribution from "../viz/Distribution";
import DistributionSlider from "../viz/DistributionSlider";

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
<<<<<<< HEAD
        <Distribution />
        <DistributionSlider />
=======
        <SimMap/>
        <SimLine/>
        <SimDots/>
        <SimBar/>
>>>>>>> b416aec9a40cc93f1ff03c08436ab196374cca6e
      </Article>
    );
  }
}
