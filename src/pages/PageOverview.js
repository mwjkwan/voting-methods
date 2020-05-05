/** @jsx jsx */

import { Component } from "react";
import { css, jsx } from "@emotion/core";

import Description from "../components/Description";
import Article from "../components/Article";
import Narrative from "../viz/Narrative";


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
      <div>
        <Article {...content}>
          <div css={style}>
          </div>
        </Article>
        <Narrative />
      </div>
    );
  }
}
