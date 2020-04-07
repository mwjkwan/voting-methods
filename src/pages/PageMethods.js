/** @jsx jsx */

import { Component } from "react";
import { css, jsx } from "@emotion/core";
import { CardColumns, Card } from "react-bootstrap";

import Description from "../components/Description";
import Article from "../components/Article";
const methods = require("../assets/data/methods.json");

const story = <div>The different methods we plan to cover.</div>;

const content = {
  header: "Methods"
};

const style = css`
  div {
    font-size: 18px !important;
  }
  .card-columns {
    margin: 1em;
    max-width: 90vw;
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
          {methods.map(method =>
            <Card>
              <Card.Body>
                <Card.Title>{method.name}</Card.Title>
                <Card.Text>
                  {method.summary}
                </Card.Text>
            </Card.Body>
            </Card>
          )}
      </CardColumns>
      </div>
    );
  }
}
