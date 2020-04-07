/** @jsx jsx */

import { Component } from "react";
import { css, jsx } from "@emotion/core";
import { CardColumns } from "react-bootstrap";

import Description from "../components/Description";
import Article from "../components/Article";
import MethodCard from '../components/MethodCard';
const methods = require("../assets/data/methods.json");

const story = <div>The different methods we plan to cover.</div>;

const content = {
  header: "Methods"
};

const style = css`
  .card-columns {
    margin: 1em;
    max-width: 90vw;
  }
  .card-text {
    margin-top: 0.3em;
  }
`;

export default class PageMethods extends Component {
  render() {
    return (
      <div css={style}>
        <Article {...content}>
            <Description>{story}</Description>
        </Article>
        <CardColumns>
          {methods.map(method => < MethodCard info={method}/> )}
        </CardColumns>
      </div>
    );
  }
}
