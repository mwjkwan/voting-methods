/** @jsx jsx */

import { Component } from "react";
import { css, jsx } from "@emotion/core";

import Description from "../components/Description";
import Article from "../components/Article";
import Landing from "../viz/Landing";

const story = <div className="big">Voting systems have the power to change election outcomes.</div>;

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
    font-size: 3em !important;
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
              <hr></hr>
            </Description>
          </div>
        <Landing />
      </div>
    );
  }
}
