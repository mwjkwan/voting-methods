/** @jsx jsx */

import { Component } from "react";
import { css, jsx } from "@emotion/core";
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup'
import ToggleButton from 'react-bootstrap/ToggleButton'
import Description from "../components/Description";
import Article from "../components/Article";
import Distribution from "../viz/Distribution";

const aboutProject = (
  <div>
    <p>
    We've visualized election outcomes for different ideological distributions. Drag each candidate across the ideological spectrum to see how each candidate's position affects the election outcome for both FPTP and RCV.
    </p>
    <br></br>
  </div>
);

const aboutStyle = css`
  .description {
    text-align: center !important;
    display: inline-block
    max-width: 800px;
  }
  div {
    font-size: 18px !important;
  }
  .desc {
    padding: 3em;
  }
  #descLast {
    padding-top: 0;
  }
  .subheading {
    padding-left: 1em;
    padding-top: 1em;
  }
  .big {
    margin-bottom: 1em;
    margin-top: 1.5em;
    font-size: 2em !important;
    font-weight: 700;
    color: black;
    line-height: 1;
  }
`;

export default class PageDistribution extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dist: "normal",
      }
    }

  handleDist = (value) => {
    console.log(value);
    this.setState({dist: value});
    this.renderDistribution();
  }

  renderDistribution () {
    const { dist } = this.state;
    return (<Distribution dist={dist} />)
  }

  render() {
    const { dist } = this.state;
    return (
      <div css={aboutStyle}>
        <Article>
          <div className="subheading">
            <div className="big">Ideological Spectrum Simulation</div>
            {aboutProject}
          </div>
          <Description>
          <div className="dist-toggle">
            <ToggleButtonGroup
              name="Distribution"
              type="radio"
              defaultValue={"normal"}
              size="md"
              onChange={this.handleDist}
            >
              <ToggleButton value="normal">Normal</ToggleButton>
              <ToggleButton value="bimodal">Bimodal</ToggleButton>
              <ToggleButton value="uniform">Uniform</ToggleButton>
            </ToggleButtonGroup>
          </div>
          {dist === "normal" && <Distribution dist={"normal"} />}
          {dist === "uniform" && <Distribution dist={"uniform"} />}
          {dist === "bimodal" && <Distribution dist={"bimodal"} />}
          </Description>
        </Article>
      </div>
    );
  }
}
