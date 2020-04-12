/** @jsx jsx */

import { Component } from "react";
import { css, jsx } from "@emotion/core";

import Description from "../components/Description";
import Article from "../components/Article";
import Landing from "../viz/Landing";

const story = <div>The voting methods project aims to help everyone better understand
the process and outcome of different voting methods.
The result of an election can hinge on the specific electoral method used. </div>;

const content = {
  header: "Home"
};

const style = css`
  div {
    font-size: 18px !important;
  }
`;

export default class PageHome extends Component {
  render() {
    return (
      <div>
        <Article {...content}>
          <div css={style}>
            <Description>{story}</Description>
          </div>
        </Article>
        <Landing />
      </div>
    );
  }
}
