/** @jsx jsx */

import { Component } from "react";
import { css, jsx } from "@emotion/core";

import Description from "../components/Description";
import Article from "../components/Article";
import Distribution from "../viz/Distribution";

const aboutProject = (
  <div>
    <p>
    This project was created by a group of Harvard undergrads for
    a course on campaigns and elections:
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
`;

export default class PageAbout extends Component {
  render() {
    return (
      <Article {...content}>
        <div css={aboutStyle}>
          <Description>
            <Distribution />
            {aboutProject}
          </Description>
        </div>
      </Article>
    );
  }
}
