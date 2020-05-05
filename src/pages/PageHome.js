/** @jsx jsx */

import { Component } from "react";
import { css, jsx } from "@emotion/core";

import Description from "../components/Description";
import Article from "../components/Article";
import Landing from "../viz/Landing";

const story = (
  <div className="blurb">
  <div className="big">Voting systems have the power to change election outcomes. </div>
  <br></br>
  <p>As a result, it is vital that voters, activists, and politicians remain informed about different electoral methods.</p>
  <br></br>
  </div>
  );

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
    font-size: 2.5em !important;
    font-weight: 700;
    color: black;
    line-height: 1;
  }

  .blurb {
    margin-left: 8%;
    padding-bottom: 0%;
    margin-bottom: 0%;
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
