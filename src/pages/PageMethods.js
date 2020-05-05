/** @jsx jsx */

import { Component } from "react";
import { css, jsx } from "@emotion/core";
import { CardColumns, Button, ButtonGroup } from "react-bootstrap";

import Description from "../components/Description";
import Article from "../components/Article";
import MethodCard from '../components/MethodCard';
const methods = require("../assets/data/methods.json");

const story = <div id="methods">
                There are many voting systems which are variations of First Past the Post (FPTP) and Ranked Choice Voting (RCV).
                This tool allows you to explore and gain a better understanding of how these different methods work, as well as their pros and cons.
              </div>;

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
  #methods {
    font-size: 18px;
    padding-bottom: 2%;
    margin-left: 4.3%;
    margin-bottom: 1em;
    margin-top: 1em;
  }
  .big {
    margin-top: 1.5em;
    margin-bottom: 1em;
    font-size: 2em !important;
    font-weight: 700;
    color: black;
    line-height: 1;
    margin-left: 3.6%;
  }
  #scootit {
    margin-left: 4%;
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
        <Article>
            <br></br>
            <div className="big">Voting Methods Reference</div>
            {story}
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
