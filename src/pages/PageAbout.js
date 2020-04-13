/** @jsx jsx */

import { Component } from "react";
import { css, jsx } from "@emotion/core";

import Description from "../components/Description";
import Article from "../components/Article";

const aboutProject = (
  <div>
    <p>
    This project was created by a group of Harvard undergrads created as part
    of a course on political campaigns and elections:
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
    on the voting methods space, providing background research, and advising
    us on visualizations and the scope and direction of our project:
    </p>
    <br></br>
    <ul>
      <li>Russell Mindich, Harvard '20</li>
      <li>Jeremy Seitz-Brown from FairVote</li>
      <li>Chris Oates from Voter Choice</li>
      <li>Larry Buchanan from The New York Times</li>
      <li>Brandon Martinez and Xavier from Voters Choose</li>
      <li>Professor Sarah John from University of Virginia</li>
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
          <Description>{aboutProject}</Description>
        </div>
      </Article>
    );
  }
}
