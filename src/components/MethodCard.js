/** @jsx jsx */

import React from "react";
import { css, jsx } from "@emotion/core";
import { Card } from "react-bootstrap";

const MethodCard = props => {
  const method = props.info;
  return (
      <Card>
        <Card.Img variant="top" src="https://sightline-wpengine.netdna-ssl.com/wp-content/uploads/2017/11/Screenshot-of-alternative-voting-systems-in-the-US-map.-Graphic-by-Sightline-Institute..png"/>
        <Card.Body>
          <Card.Text>
            {method.type.toUpperCase()}
          </Card.Text>
          <Card.Title>{method.name}</Card.Title>
          <Card.Text><b>How it works: </b>{method.summary}</Card.Text>
          <Card.Text>{method.description}</Card.Text>
          <Card.Text><b>Pros: </b>{method.pros}</Card.Text>
          <Card.Text><b>Cons: </b>{method.cons}</Card.Text>
          <Card.Text><b>Used in: </b>{method.locations.join(", ")}</Card.Text>
        </Card.Body>
      </Card>
  );
};

export default MethodCard;
