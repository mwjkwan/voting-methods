/** @jsx jsx */

import React from "react";
import { css, jsx } from "@emotion/core";
import { Card } from "react-bootstrap";

const style = css`
  img {
    max-width: 200px;
  }
  .card-text {
    margin-top: 0.3em;
    line-height: 2px !important;
  }
  .card {
    box-shadow: 5px 10px #888888;
  }
  .card-title {
    color: #000000 !important;
  }
`;

const MethodCard = props => {
  const method = props.info;
  return (
      <Card>
        <Card.Img variant="top" src={require('../assets/methods/' + method.img)}/>
        <Card.Body>
          <Card.Text>{method.type.toUpperCase()}</Card.Text>
          <Card.Title>{method.name}</Card.Title>
          <Card.Text><b>{"HOW IT WORKS"}</b></Card.Text>
          <Card.Text>{method.summary}</Card.Text>
          <Card.Text>{method.description}</Card.Text>
          <br />
          <Card.Text><b>{"PROS"}</b></Card.Text>
          <Card.Text>{method.pros}</Card.Text>
          <br />
          <Card.Text><b>{"CONS"}</b></Card.Text>
          <Card.Text>{method.cons}</Card.Text>
          {method.locations &&  <br />}
          {method.locations &&  <Card.Text><b>Used in: </b>{method.locations.join(", ")}</Card.Text>}
        </Card.Body>
      </Card>
  );
};

export default MethodCard;
