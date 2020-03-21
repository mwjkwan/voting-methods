/** @jsx jsx */

import { Component } from "react";
import { css, jsx } from "@emotion/core";

import Description from "../components/Description";
import Article from "../components/Article";

const story = <div>The different methods we plan to cover.</div>;

const content = {
  header: "Methods"
};

const style = css`
  div {
    font-size: 18px !important;
  }
`;

export default class PageMethods extends Component {
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
