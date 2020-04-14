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
    padding: 10vh 2vw;
    display: flex;
    justify-content: space-between;
  }

  .graphic {
    flex-basis: 50%;
    position: sticky;
    top: 15vh;
    width: 100%;
    height: 75vh;
    align-self: flex-start;
  }

  .data {
    font-size: 5rem;
    text-align: center
  }

  .scroller {
    flex-basis: 30%;
  }

  .jumplinks {
    position: sticky;
    top: 160px;
    width: 200px;
    align-self: flex-start;

  }

  .step {
    margin-right: 50px;
    padding-top: 200px;
    padding-bottom: 200px;
    '&:last-child': {
      margin-bottom: 0;
    }
  }

  .desc {
    margin-left:20px;
    margin-right:20px;

  }

  .btn {
    color: #575757;
  }
`;

export default class Narrative extends Component {
  constructor(props) {
    super(props);
    //const stories = ['Motivation', 'FPTP', 'con 1', 'example 1', 'con 2', 'example 2']
    this.state = {
      data: "",
      svg: null,
      state: 0,
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
  }

  onStepExit= ({ element }) => {
    element.style.backgroundColor = '#fff';
    this.update();
  }



  onStepProgress = ({ element, progress }) => {
    this.setState({ progress });
  }

  componentDidMount() {
    this.initialize();
  }

  update() {
    console.log('updating');
    console.log(this.state.progress)

    var svg = this.state.svg;

    // if (this.state.progress == 1) {
    //   console.log("removing")
    //   svg.select("rect").remove()
    //   svg.select("text").remove()
    //   svg.select("cand").remove()
    //   svg.select("boxes").remove()
    // }

  }

  sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
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

    // initalize FPTP explanation
    var svg = d3.select("#viz")
                .append('svg')
                .attr('width', width)
                .attr('height', height);
    // svg.append("circle").attr("cx",width/2).attr("cy",height/10).attr("r",6).style("fill", "steelblue" );
    // svg.append("circle").attr("cx",width/2).attr("cy",height/10+15).attr("r",6).style("fill", "steelblue" );
    // svg.append("circle").attr("cx",width/2).attr("cy",height/10+30).attr("r",6).style("fill", "red" );
    var data = [...Array(5).keys()]
    var myColor = d3.scaleOrdinal().domain(data).range(["#ED4F3A", "#34495D", "#34495D", "#ED4F3A", "#ED4F3A"])
    svg.selectAll("votes").data(data).enter().append("circle")
       .attr("cx", 3*width/4).attr("cy", function(d,i){return 30 + i*15})
       .attr("r", 6).attr("fill", function(d){return myColor(d) })

    svg.append("rect").attr("x", width/4).attr("y", width/4).attr("width", width/4).attr("height", width/4).style("fill", "#F4F4F4");
    var text = svg.append("text")
                  .attr("x", 10.3*width/32)
                  .attr("y", width/4 + 30)
                  .text("Ballot")
                  .attr("font-family", "akkurat")
                  .attr("font-size", "24px")
                  .attr("fill", "black");
    var box = [...Array(3).keys()]
    svg.selectAll("boxes").data(box).enter().append("circle")
       .attr("cx", width/4 + width/25).attr("cy", function(d,i){return width/4 + 3*width/32 + i*width/20})
       .attr("r", width/80).attr("fill", "#C4C4C4")
   var cand = ["Rodrigo Red", "Belinda Blue", "Gracey Grey"]
   svg.selectAll("cand").data(cand).enter().append("text")
                 .attr("x", width/4 + width/14)
                 .attr("y", function(d,i){return width/4 + 3*width/32 + 5+ i*width/20})
                 .text(function(d, i){return d})
                 .attr("font-family", "akkurat")
                 .attr("font-size", "16px")
                 .attr("fill", "black");

    var text = svg.append("text")
                  .attr("x", 10.3*width/32)
                  .attr("y", width/4 + 30)
                  .text("Ballot")
                  .attr("font-family", "akkurat")
                  .attr("font-size", "24px")
                  .attr("fill", "black");

    // ballot to dot transformation
    var vote = svg.append("circle")
                  .attr("cx", width/4 + width/25).attr("cy", width/4 + 3*width/32 + width/20)
                  .attr("r", width/80).attr("fill", "#2994D2")

    vote.transition()
        .duration(2000)
        .attr("cx", 3*width/4)
        .attr("cy", 30 + 5*15)
        .attr("r", 6)

    this.sleep(2000).then(() => {
      var vote = svg.append("circle")
                    .attr("cx", width/4 + width/25).attr("cy", width/4 + 3*width/32 + 2*width/20)
                    .attr("r", width/80).attr("fill", "#34495D")

      vote.transition()
          .duration(2000)
          .attr("cx", 3*width/4)
          .attr("cy", 30 + 6*15)
          .attr("r", 6)

    })

    //

    // svg.selectAll("circle")
    // .data([[32, 50], [87, 30], [112, 91], [150, 50]])
    // .enter().append("circle")
    // .attr("cy", function(d) {return d[0]})
    // .attr("cx", function(d, i) { return d[1] })
    // .attr("r", function(d) { return Math.sqrt(d[0]); })
    // .style("fill", ["purple", "blue", "red", "green"]);

    this.setState({initialized: true, svg: svg});
    console.log("initialized")

  }


  jumpLink(index) {
    console.log('okthere')
    this.setState({data: descriptions[3].description})
    // should call update wtih the appropriate paramters
    // so that we display the locations of "index"
  }



  render() {
    const { data, value } = this.state;


    return (
      <div css={narrativeStyle}>

      <div className='main'>
        <div className='jumplinks'>
          Jump to:
          <button type="button" href="#desc1" class="btn btn-link">FPTP Explanation</button>
          <a href="#desc1" onClick={this.jumpLink.bind(this, 2)} class="btn btn-link">RCV Explanation</a>
          <button type="button" href="#desc4"  class="btn btn-link">Polarization</button>
          <button type="button" href="#desc5"  class="btn btn-link">Representativeness</button>
          <button type="button" href="#desc2"  class="btn btn-link">Strategic Voting</button>
        </div>
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
          >
            {descriptions.map ( desc => (
              <Step data={desc.key} key={desc.key}>
                <div className="step" >
                  <p className = "desc" id={"desc" + desc.key}>{desc.description}</p>
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
