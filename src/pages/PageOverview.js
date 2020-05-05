/** @jsx jsx */

import { Component } from "react";
import { css, jsx } from "@emotion/core";

import Description from "../components/Description";
import Article from "../components/Article";
import Narrative from "../viz/Narrative";

const style = css`
  div {
    font-size: 18px !important;
  }
  .big {
    margin-top: 1.5em;
    margin-bottom: 1em;
    margin-left: 2%;
    font-size: 2em !important;
    font-weight: 700;
    color: black;
    line-height: 1;
  }
`;

export default class PageOverview extends Component {
  render() {
    return (
      <div>
        <Article>
          <div css={style}>
            <br></br>
            <div className="big">The Story</div>
          </div>
        </Article>
        <Narrative />
      </div>
    );
  }
}
