/** @jsx jsx */

import { Component } from "react";
import { css, jsx } from "@emotion/core";
import { Card } from "react-bootstrap";
import Article from "../components/Article";

const aboutProject = (
  <div>
    <p>
    Elections can hinge on the electoral method used. We built <b>The Voting Methods Project</b> as a resource to help academics, election reform activistsm, and political actors illustrate the effects of different voting systems.
    </p>
    <br></br>
    <p>
      The Voting Methods Project is a tool that:
    </p>
      <br></br>
      <ul>
        <li>showcases the various electoral methods used throughout the world, </li>
        <li>narrates an explanation and comparison of <b>First Past the Post (FPTP)</b> and <b>Ranked Choice Voting (RCV)</b>,</li>
        <li>enables users to discover for themselves how the same pool of voters can result in a different election outcome depending on the voting method used,</li>
        <li>extends these ideas to actual RCV elections which would have had different results under FPTP, and</li>
        <li>provides a catalog which details out the various pros and cons of different FPTP and RCV electoral methods.</li>
      </ul>
    <br></br>
    <hr></hr>
    <br></br>
    <p>
    This project was brought to you by:
    </p>
    <br></br>
    <ul>
      <li>
        Gabriel Apoj Pascal <space></space>
        (<a href="mailto:gabapoj@gmail.com">Email</a>)
      </li>
      <li>Melissa Kwan</li>
      <li>
        Sahana Srinivasan <space></space>
        (<a href="mailto:sahanas009@gmail.com">Email</a>, <space></space>
         <a href="https://github.com/sahana-srinivasan">GitHub</a>)
        </li>
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
    line-height: 1.2;
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
          The Voting Methods Project allows you to explore and evaluate these different systems.
        </div>
        <br></br>
        <div className="blurb">{aboutProject}</div>
      </Article>
      </div>
    );
  }
}
