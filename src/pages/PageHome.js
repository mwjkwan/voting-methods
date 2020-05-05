/** @jsx jsx */

import { Component } from "react";
import { css, jsx } from "@emotion/core";

import Description from "../components/Description";
import Article from "../components/Article";
import Landing from "../viz/Landing";

const story = <div className="big">The Voting Methods Project aims to help everyone better understand
the process and outcome of different voting methods.
The result of an election can hinge on the specific electoral method used. </div>;

const style = css`
  div {
    font-size: 18px;
    font-size: 20px !important;
    line-height: 1;
  }
  .graphic {
    text-align: right !important;
  }
  .big {
    margin-top: 12%;
    margin-left: 8%;
    font-size: 2em !important;
    font-weight: 700;
    color: black;
    line-height: 1;
  }
`;

export default class PageHome extends Component {
  render() {
    return (
      <div>
          <div css={style}>
            <Description>
              {story}
            </Description>
          </div>
        <Landing />
      </div>
    );
  }
}
