/** @jsx jsx */

import { Component } from "react";
import { css, jsx } from "@emotion/core";

import Description from "../components/Description";
import Article from "../components/Article";

const aboutProject = (
  <div>
    <p>
    In the US, the predominant voting system is <b>First Past the Post (FPTP)</b>, where each voter selects one candidate and the candidate with the most votes wins. 
    While intuitive, it creates counterproductive incentives for both candidates and voters. Groups like FairVote, Voter Choice, Ballot Ready, and Voters Choose are advocating <b>Ranked Choice Voting (RCV)</b>, where voters can rank their preferences for multiple candidates. 
    </p>
    <br></br>
    <p>
    Thus, for a course on campaigns and elections, we built <b>The Voting Methods Project</b> as a resource to help academics and election reform activists illustrate the effects of different voting systems.
    </p>
    <br></br>
    <hr></hr>
    <br></br>
    <p>
    This project was brought to you by:
    </p>
    <br></br>
    <ul>
      <li>Gabriel Apoj</li>
      <li>Melissa Kwan</li>
      <li>Sahana Srinivasan</li>
      <li>Yijiang Zhao</li>
      <li>Isabelle Zheng</li>
    </ul>
    <br></br>
    <p>
    We'd like to thank the following people for helping us orient ourselves
    in the voting methods space, providing background information, and advising
    us on the scope and direction of our project:
    </p>
    <br></br>
    <ul>
      <li>Nicco Mele, Harvard Kennedy School</li>
      <li>Paul Dingus, Bluebonnet Data</li>
      <li>Russell Mindich, Harvard College '20</li>
      <li>Jeremy Seitz-Brown, FairVote</li>
      <li>Chris Oates, Voter Choice</li>
      <li>Larry Buchanan, The New York Times</li>
      <li>Brandon Martinez, Voters Choose</li>
      <li>Xavier Morales, Voters Choose</li>
      <li>Professor Sarah John, University of Virginia</li>
      <li>Sebastian Ellefson, Ballot Ready</li>
    </ul>
  </div>
);

const content = {
  header: "About"
};

const aboutStyle = css`
  div {
    font-size: 18px !important;
  }

  .blurb {
    margin-left: 8%;
    font-size: 15px;
    margin-bottom: 8%;
  }

  .big {
    margin-top: 8%;
    margin-left: 8%;
    font-size: 50px;
    font-weight: 700;
  }
`;

export default class PageAbout extends Component {
  render() {
    return (
      <Article {...content}>
      <div css={aboutStyle}>
        <p className = "big">Voting systems have the power to change election outcomes.</p>
        <br></br>
        <div className = "blurb">
          {aboutProject}
        </div>
      </div>
      </Article>
    );
  }
}
