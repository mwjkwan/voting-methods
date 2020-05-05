/** @jsx jsx */

import { Component } from "react";
import { css, jsx } from "@emotion/core";
import { CardColumns, Button, ButtonGroup } from "react-bootstrap";

import Description from "../components/Description";
import Article from "../components/Article";
import MethodCard from '../components/MethodCard';
const methods = require("../assets/data/methods.json");

const story = <div id="methode">
              There are many voting systems which are variations of First Past the Post (FPTP) and Ranked Choice Voting (RCV). 
              This tool allows you to explore and gain a better understanding of how these different methods work, as well as their pros and cons.
              </div>;

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
  #methode {
    font-size: 18px;
    padding-bottom: 2%;
    margin-left: 4.3%;
    margin-bottom: 1em;
    margin-top: 1em;
  }
  .big {
    margin-top: 1.3em;
    margin-bottom: 1em;
    font-size: 2em !important;
    font-weight: 700;
    color: black;
    line-height: 1;
    margin-left: 3.6%;
  }
  #scootit {
    margin-left: 4%;
    margin-bottom: 4%;
  }
  #scootit2 {
    margin-left: 3.6%;
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
            <div className="big">Reference</div>
            <Description >{story}</Description>
            <Button  id="scootit2" variant={rcv ? "primary" : "secondary"} onClick={this.toggleRCV}>Ranked Choice (RCV)</Button>{' '}
            <Button variant={fptp ? "success" : "secondary"} onClick={this.toggleFPTP}>First Past the Post (FPTP)</Button>{' '}
        </Article>
        <CardColumns  id="scootit">
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
