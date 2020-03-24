/** @jsx jsx */

import { Component } from "react";
import { css, jsx } from "@emotion/core";

import Description from "../components/Description";
import Article from "../components/Article";
import Landing from "../viz/Landing";

const story = <div>The voting tour of the world!</div>;

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
