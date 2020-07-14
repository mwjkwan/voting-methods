/** @jsx jsx */

import { Component } from "react";
import { css, jsx } from "@emotion/core";
import { CardColumns, Button, ButtonGroup } from "react-bootstrap";

import Description from "../components/Description";
import Article from "../components/Article";
import MethodCard from '../components/MethodCard';
const methods = require("../assets/data/methods.json");

const story = <div id="methods">
                Many voting systems are variations of First Past the Post (FPTP) and Ranked Choice Voting (RCV).
                This tool allows you to explore how these different methods work, as well as their pros and cons. Click on a method to learn more about it.
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
    margin-left: 4%;
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
    margin-left: 4%;
  }
  #cards {
    margin-left: 4%;
    margin-bottom: 4%;
  }
  #heading {
    margin-left: 4%;
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
        <Article id="align">
            <br></br>
            <div className="big">Voting Methods Reference</div>
            {story}
            <div id="heading">
              <p>Filter by type:</p>
              <Button variant={rcv ? "primary" : "secondary"} onClick={this.toggleRCV}>Ranked Choice (RCV)</Button>{' '}
              <Button variant={fptp ? "success" : "secondary"} onClick={this.toggleFPTP}>First Past the Post (FPTP)</Button>{' '}
            </div>
        </Article>
        <CardColumns  id="cards">
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
