/** @jsx jsx */

import { Component } from "react";
import { css, jsx } from "@emotion/core";
import { Card } from "react-bootstrap";
import Description from "../components/Description";
import Article from "../components/Article";
import Distribution from "../viz/Distribution";

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
    <br></br>
    <Card>
      <Card.Img variant="top" src={require('../assets/img/credits.png')}/>
    </Card>
  </div>
);

const content = {
};

const aboutStyle = css`

  .blurb {
    margin-left: 1.9em;
    font-size: 18px;
    margin-bottom: 8%;
  }

  .credits {
    max-width: 60vw;
  }

  .big {
    margin-top: 1.5em;
    margin-left: 1em;
    font-size: 2em;
    font-weight: 700;
    color: black;
    line-height: 1;
  }
`;

export default class PageAbout extends Component {
  render() {
    return (
      <div css={aboutStyle}>
      <Article>
        <br></br>
        <div className = "big">
          Many voting systems are variations of First Past the Post (FPTP) and Ranked Choice Voting (RCV). 
          The Voting Methods Project allows you to explore and gain a better understanding of how these different systems work, as well as their benefits and drawbacks.
        </div>
        <br></br>
        <div className="blurb">{aboutProject}</div>
      </Article>
      </div>
    );
  }
}
