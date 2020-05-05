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
    Elections can hinge on the specific electoral method used. Thus, realizing the importance of informing political actors of different electoral methods,
     we built <b>The Voting Methods Project</b> as a resource to help academics and election reform activists illustrate the effects of different voting systems.
    </p>
    <br></br>
    <p>
      The Voting Methods Project seeks to act as a resource which provides tools to:
    </p>
      <br></br>
      <ul>
        <li>showcase the various electoral methods used throughout the world, </li>
        <li>narrate an explanation and comparison of <b>First Past the Post (FPTP)</b> and <b>Ranked Choice Voting (RCV)</b>,</li>
        <li>enable users to discover for themselves how the same pool of voters can result in a different election outcome depending on the voting method used,</li>
        <li>extend these ideas to actual RCV elections which would have had different results under FPTP, and</li>
        <li>provide a catalog which details out the various pros and cons of different FPTP and RCV electoral methods.</li>
      </ul>
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

  .credits {
    max-width: 60vw;
  }

  .big {
    margin-top: 8%;
    margin-left: 8%;
    font-size: 50px;
    font-weight: 700;
    color: black;
    line-height: 1;
  }
`;

export default class PageAbout extends Component {
  render() {
    return (
      <div css={aboutStyle}>
      <Article {...content}>
        <p className = "big">The Voting Methods Project aims to help everyone better understand
the process and outcome of different voting methods.</p>
        <br></br>
        <div className = "blurb">
        <Description>{aboutProject}</Description>
        </div>
      </Article>
      </div>
    );
  }
}
