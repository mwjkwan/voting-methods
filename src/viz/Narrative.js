/** @jsx jsx */
import React, { Component } from 'react';
import { css, jsx } from '@emotion/core';
import { Scrollama, Step } from 'react-scrollama';
import { select, selectAll, mouse } from 'd3-selection';
import { csv } from 'd3-fetch';
import { path } from 'd3-path';
import { scaleOrdinal } from 'd3-scale';
import { transition } from 'd3-transition';
import { nest } from 'd3-collection';
import d3Tip from 'd3-tip';
const descriptions = require("../assets/data/narrative.json");
const locations = require("../assets/data/narrative-locs.json");

const d3 = { select, selectAll, mouse, csv, path, scaleOrdinal, transition,
         nest };


// const descriptions = {
//   'Motivation': 'this is the first description',
//   'FPTP': 'this is the second description',
//   'con 1': 'this is the third description',
//   'example 1': 'this is the fourth description',
//   'con 2': 'this is the fifth description',
//   'example 2': 'this is the sixth description'
// }


const narrativeStyle = css`
  .main {
    padding: 60vh 2vw;
    display: flex;
    justify-content: space-between;
  }

  .graphic {
    flex-basis: 50%;
    position: sticky;
    top: 160px;
    width: 100%;
    height: 300px;
    align-self: flex-start;
    background-color: #F0FFFF;
  }

  .data {
    font-size: 5rem;
    text-align: center
  }

  .scroller {
    flex-basis: 30%;
  }

  .step {
    padding-top: 200px;
    padding-bottom: 200px;
    '&:last-child': {
      margin-bottom: 0;
    }
  }
`;

export default class Narrative extends Component {
  constructor(props) {
    super(props);
    //const stories = ['Motivation', 'FPTP', 'con 1', 'example 1', 'con 2', 'example 2']
    this.state = {
      data: "",
      svg: null,
      //value: 0,
      //stories: stories,
      //steps: [...stories.keys()], // ... is array destructuring operator
      progress: 0,
      initialized: false,
    }
  }

  onStepEnter = ({ element, data }) => {
    element.style.backgroundColor = 'lightgoldenrodyellow';
    this.setState( { data });
    this.update();
  }

  onStepExit= ({ element }) => {
    element.style.backgroundColor = '#fff';
  }



  onStepProgress = ({ element, progress }) => {
    this.setState({ progress });
  }

  componentDidMount() {
    this.initialize();
  }

  update() {
    console.log('updating');

    var svg = this.state.svg;

    var circle = svg.selectAll("circle")
    .data([[Math.floor(Math.random() * 300), 100],
           [Math.floor(Math.random() * 300), 200],
           [Math.floor(Math.random() * 300), 300],
           [Math.floor(Math.random() * 300), 400]])

    circle.transition()
          .duration(500)
          .attr("cy", function(d) {return d[0]})
          .attr("cx", function(d, i) { return d[1] })
          .attr("r", function(d) { return Math.sqrt(d[0]); })
          .style("fill", "purple");

  }

  initialize() {
    // thanks xisabao
    var parentWidth = d3
      .select('.graphic')
      .node()
      .getBoundingClientRect().width;


    const margin = { top: 0, right: 0, bottom: 0, left: 0 };

    const width = parentWidth - margin.left - margin.right;
    const height = 800 - margin.top - margin.bottom;


    var svg = d3.select("#viz")
                .append('svg')
                .attr('width', width)
                .attr('height', height);

    svg.selectAll("circle")
    .data([[32, 50], [87, 30], [112, 91], [150, 50]])
    .enter().append("circle")
    .attr("cy", function(d) {return d[0]})
    .attr("cx", function(d, i) { return d[1] })
    .attr("r", function(d) { return Math.sqrt(d[0]); })
    .style("fill", "purple");

    this.setState({initialized: true, svg: svg});

}



  render() {
    const { data, value } = this.state;


    return (
      <div css={narrativeStyle}>
      <div className='main'>
        <div className='graphic'>
          <div id="viz"></div>
        </div>
        <div className='scroller'>
          <Scrollama
            onStepEnter={this.onStepEnter}
            onStepExit={this.onStepExit}
            progress
            onStepProgress={this.onStepProgress}
            offset={0.33}
            debug
          >
            {descriptions.map ( desc => (
              <Step data={desc.description} key={desc.key}>
                <div className='step'>
                  <p>{desc.description}</p>
                </div>
              </Step>
            ))}
          </Scrollama>
         </div>
      </div>
      </div>
      )
  }
}
