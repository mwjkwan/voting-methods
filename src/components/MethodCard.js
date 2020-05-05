/** @jsx jsx */

import React from "react";
import { css, jsx } from "@emotion/core";
import { Card } from "react-bootstrap";
import Button from 'react-bootstrap/Button'

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

export default class MethodCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    };
    this.toggleView = this.toggleView.bind(this);
  }

  toggleView () {
    this.setState(prevState => ({expanded: !prevState.expanded}))
  }

  render () {
    const method = this.props.info;
    const expanded = this.state.expanded;
    return (
      <Card>
        <Card.Img variant="top" onClick={this.toggleView} src={require('../assets/methods/' + method.img)}/>
        {expanded && <Card.Body>
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
          <br />
          <Button onClick={this.toggleView}>See Less</Button>
        </Card.Body>}
      </Card>
    )
  }
};
