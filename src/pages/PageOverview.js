/** @jsx jsx */

import { Component } from "react";
import { css, jsx } from "@emotion/core";

import Description from "../components/Description";
import Article from "../components/Article";

const story = (
  <div>This page shows the narrative of the different voting methods.</div>
);

const content = {
  header: "The Story"
};

const style = css`
  div {
    font-size: 18px !important;
  }
`;

export default class PageOverview extends Component {
  render() {
    return (
      <Article {...content}>
        <div css={style}>
          <Description>{story}</Description>
        </div>
      </Article>
    );
  }
}
