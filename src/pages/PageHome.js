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
  <p>
    In the US, the predominant voting system is <b>First Past the Post (FPTP)</b>, where each voter selects one candidate and the candidate with the most votes wins. 
    While intuitive, it creates counterproductive incentives for both candidates and voters. Groups like FairVote, Voter Choice, Ballot Ready, and Voters Choose are advocating <b>Ranked Choice Voting (RCV)</b>, where voters can rank their preferences for multiple candidates. 
  </p>
  <br></br>
  <p>The Voting Methods Project seeks to inform voters, activists, and politicians of different electoral methods through visualization, narrative explanations, interactive experiments, and simulations of real life elections.</p>
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
    line-height: 1.5;
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
