/** @jsx jsx */

import { Component } from "react";
import { css, jsx } from "@emotion/core";
import { CardColumns, Button, ButtonGroup } from "react-bootstrap";

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
  .table {
    margin: 1em;
    max-width: 90vw;
  }
`;

export default class PageMethods extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rcv: true,
      fptp: true
    };
  }

  toggleRCV = () => {
    this.setState(prevState => ({
        rcv: !prevState.rcv,
      }))
  }

  toggleFPTP = () => {
    this.setState(prevState => ({
        fptp: !prevState.fptp,
      }))
  }

  render() {
    const { rcv, fptp } = this.state;
    return (
      <div css={style}>
        <Article {...content}>
            <Description>{story}</Description>
            <Button variant="primary" onClick={this.toggleRCV}>Ranked Choice (RCV)</Button>{' '}
            <Button variant="success" onClick={this.toggleFPTP}>First Past the Post (FPTP)</Button>{' '}
        </Article>
        <CardColumns>
          {methods.map(method => {
            if (rcv && method.type === 'Ranked Choice (RCV)' 
            || fptp && method.type === 'First Past the Post (FPTP)') {
              return < MethodCard info={method}/> 
            }
            return
          })}
        </CardColumns>
      </div>
    );
  }
}
