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
const descriptions = require("../assets/data/polarization.json");


const d3 = { select, selectAll, mouse, csv, path, scaleOrdinal, transition,
         nest };

const narrativeStyle = css`
  .main {
    padding: 10vh 2vw;
    display: flex;
    justify-content: space-between;
  }

  .graphic2 {
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

  .blurb {
    margin: 20%;
    margin-top: 10%;
    margin-bottom: 10%;
    text-align: center;
    font-size: 25px;
  }

  .desc {
    margin-left:20px;
    margin-right:20px;

  }

  .btn {
    color: #575757;
  }
`
;

export default class Polarization extends Component {
  constructor(props) {
    super(props);
    //const stories = ['Motivation', 'FPTP', 'con 1', 'example 1', 'con 2', 'example 2']
    this.state = {
      data: "",
      svg: null,
      step: 0,
      width: 0,
      height: 0,
      redSize: 0,
      blueSize: 0,
      greySize: 0,
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
    console.log(data)
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

  // componentWillUnmount() {
  //   this.props.removeSelf();
  // }

  update() {
    console.log('updating');


    var svg = this.state.svg;
    var width = this.state.width

    if (this.state.data === "1") {


      var red = svg.selectAll("#red[blue-detractor=false][grey-detractor=false]")
      var redSize = red.size()
      red.transition()
        .duration(2000)
        .attr("cx", function(d, i) {return 3*width/4 - 15 - 15*i})
        .attr("cy", 295)
        .attr("r", 6)

      red = svg.selectAll("#red[blue-detractor=false][grey-detractor=true]")
      console.log(red)
      red.transition()
        .duration(2000)
        .attr("cx", function(d, i) {return 3*width/4 - 15 - 15*i - 15*redSize})
        .attr("cy", 295)
        .attr("r", 6)
      redSize = redSize + red.size()

      red = svg.selectAll("#red[blue-detractor=true][grey-detractor=false]")
      red.transition()
        .duration(2000)
        .attr("cx", function(d, i) {return 3*width/4 - 15 - 15*i - 15*redSize})
        .attr("cy", 295)
        .attr("r", 6)

      var grey = svg.selectAll("#grey")
      grey.transition()
        .duration(2000)
        .attr("cx", function(d, i) {return 3*width/4 - 15 - 15*i})
        .attr("cy", 325)
        .attr("r", 6)

      this.setState({greySize: grey.size()})

      this.sleep(2250).then(() => {
        svg.select("#cand1").attr("font-weight", 900)
      })
    }

    if (this.state.data === "2") {
      var duds = [0, 0, 0, 0, 0, 0, 0, 0]
      svg.selectAll("duds").data(duds).enter().append("circle")
         .attr("cx", width/16).attr("cy", function(d,i){return 3*width/32 + i*15 - 15})
         .attr("r", 6).attr("fill", "#2994D2").attr("id", "blue")

      var dummy = ["Not voting yet"]
      svg.selectAll("#voterlabel1").data(dummy).enter().append("text")
                   .text("Not yet voting")
                   .attr("font-family", "akkurat")
                   .attr("font-size", "16px")
                   .attr("fill", "black")
                   .attr("id", "voterlabel1")
                   .attr("class", "voterlabel")
                   .attr("transform", "translate(25,145)rotate(-90)")
    }

    if (this.state.data === "3") {
      var dummy = ["Belina Blue"]
      svg.selectAll("#cand2").data(dummy).enter().append("text")
         .attr("x", 3*width/4 + 10)
         .attr("y", 150)
         .text("Belinda Blue")
         .attr("font-family", "akkurat")
         .attr("font-size", "16px")
         .attr("fill", "black")
         .attr("id", "cand2")
         .attr("class", "candName")

      this.sleep(500).then(() => {
        svg.selectAll("#blue").transition()
          .duration(2000)
          .attr("cx", function(d, i) {return 3*width/4 - 15 - 15*i})
          .attr("cy", 145)
          .attr("r", 6)

      })

      var blue = svg.selectAll("#blue")
      this.setState({blueSize: blue.size()})
    }

    if (this.state.data === "4") {
      var blueSize = this.state.blueSize
      svg.selectAll("#red[blue-detractor=true][grey-detractor=false]").transition()
         .duration(2000)
         .attr("fill", "#2994D2")
         .attr("cx", function(d, i) {return 3*width/4 - 15 - 15*i - 15*blueSize})
         .attr("cy", 145)
         .attr("r", 6)
    }

    if (this.state.data === "5") {
      var greySize = this.state.greySize
      console.log(svg.selectAll("#red[blue-detractor=false][grey-detractor=true]"))
      svg.selectAll("#red[blue-detractor=false][grey-detractor=true]").transition()
         .duration(2000)
         .attr("fill", "#34495D")
         .attr("cx", function(d, i) {return 3*width/4 - 15 - 15*i - 15*greySize})
         .attr("cy", 325)
         .attr("r", 6)
      svg.select("#cand1").transition().attr("font-weight", 100)
      svg.select("#cand2").transition(100).attr("font-weight", 900)
    }

    if (this.state.data === "6") {
      svg.selectAll("#red[blue-detractor=false][grey-detractor=false]").remove()
      svg.select("#cand0").remove()
    }

  }

  sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

  initialize() {
    // thanks xisabao
    var parentWidth = d3
      .select('.graphic2')
      .node()
      .getBoundingClientRect().width;


    const margin = { top: 0, right: 0, bottom: 0, left: 0 };

    const width = parentWidth - margin.left - margin.right;
    const height = 800 - margin.top - margin.bottom;
    this.setState({width, height})

    // Get a handle on the SVG
    var svg = d3.select("#viz2")
                .append('svg')
                .attr('width', width)
                .attr('height', height);

    var ax = [...Array(1).keys()]
    svg.selectAll("#axis").data(ax).enter().append("line")
                  .attr("x1", 3*width/4)
                  .attr("y1", 50)
                  .attr("x2", 3*width/4)
                  .attr("y2", 50 + 25*15)
                  .attr("stroke-width", 1.5)
                  .attr("stroke", "black")
                  .attr("id", "axis")

    var cand = ["Rodrigo Red", "Gracey Grey"]
    svg.selectAll(".candName").data(cand).enter().append("text")
                  .attr("x", 3*width/4 + 10)
                  .attr("y", function(d,i){return 300 + 30*i})
                  .text(function(d, i){return d})
                  .attr("font-family", "akkurat")
                  .attr("font-size", "16px")
                  .attr("fill", "black")
                  .attr("id", function(d, i) {return "cand".concat(i.toString())})
                  .attr("class", "candName")

    var ideo = ["More right-wing", "More left-wing"]
    svg.selectAll("axlabel").data(ideo).enter().append("text")
                  .attr("x", 3*width/4 - 50)
                  .attr("y", function(d,i){return (d === "More right-wing" ? 35 : 450)})
                  .text(function(d, i){return d})
                  .attr("font-family", "akkurat")
                  .attr("font-size", "16px")
                  .attr("fill", "black")
                  .attr("id", function(d, i) {return "axlabels".concat(i.toString())})
                  .attr("class", "axlabel")

    svg.append("text")
                  .text("Voting")
                  .attr("font-family", "akkurat")
                  .attr("font-size", "16px")
                  .attr("fill", "black")
                  .attr("id", "voterlabel2")
                  .attr("class", "voterlabel")
                  .attr("transform", "translate(25,300)rotate(-90)")

    var v =  [[1, 1, 0], [2, 0, 0], [1, 0, 0], [2, 0, 0], [2, 0, 0], [1, 0, 1],
              [2, 0, 0], [2, 0, 0], [1, 1, 0], [2, 0, 0], [2, 0, 0], [1, 0, 0],
              [1, 0, 0], [2, 0, 0], [1, 1, 0], [1, 1, 0], [2, 0, 0], [2, 0, 0]]
    svg.selectAll("votes").data(v).enter().append("circle")
       .attr("cx", width/16).attr("cy", function(d,i){return 105 + 3*width/32 + i*15 - 15})
       .attr("r", 6).attr("fill", function(d){return (d[0] === 1 ? "#ED4F3A" : "#34495D")})
       .attr("id", function(d) {return (d[0] === 1 ? 'red' : 'grey')})
       .attr("blue-detractor", function(d) {return (d[1] === 1 ? "true" : "false")})
       .attr("grey-detractor", function(d) {return (d[2] === 1 ? "true" : "false")})



    // ballot to dot transformation
    this.setState({initialized: true, svg: svg});
  }

  jumpLink(index) {
    //console.log('okthere')
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
        <div className='graphic2'>
          <div id="viz2"></div>
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
