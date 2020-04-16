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
      step: 0,
      width: 0,
      height: 0,
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

  update() {
    console.log('updating');


    var svg = this.state.svg;

    if (this.state.data == "1") {
      svg.select("rect").remove()
      svg.select("#ballot").remove()
      svg.selectAll("#cand").remove()
      svg.selectAll("#boxes").remove()

      var width = this.state.width

      svg.selectAll("circle")
        .transition()
        .duration(1500)
        .attr("cx", 10)
        .attr("cy", function(d, i) {return 50 + i*15})
        .attr("r", 6)

      this.sleep(1500).then(() => {
        var axis = svg.append("line")
                      .attr("x1", 3*width/4)
                      .attr("y1", 50)
                      .attr("x2", 3*width/4)
                      .attr("y2", 50 + 25*15)
                      .attr("stroke-width", 1.5)
                      .attr("stroke", "black")

                      var cand = ["Rodrigo Red", "Belinda Blue", "Gracey Grey"]
                      svg.selectAll("cand").data(cand).enter().append("text")
                                    .attr("x", 3*width/4 + 10)
                                    .attr("y", function(d,i){return 200 + 30*i})
                                    .text(function(d, i){return d})
                                    .attr("font-family", "akkurat")
                                    .attr("font-size", "16px")
                                    .attr("fill", "black")
                                    .attr("id", function(d, i) {return "cand"});

      })

    }

    if (this.state.data == "2") {

    }

    if (this.state.data == "22") {
      var width = this.state.width

      // remove stuff
      svg.selectAll("circle").remove();
      svg.selectAll("#cand").remove();
      svg.select("line").remove();
      svg.selectAll("#boxes").remove()

      // Initialize the ballot SVG
      svg.append("rect").attr("x", width/4-width/24).attr("y", width/4-width/100).attr("width", width/3).attr("height", width/4).style("fill", "#F4F4F4");
      var text = svg.append("text")
                    .attr("x", 10.3*width/32)
                    .attr("y", width/4 + 30)
                    .text("Ballot")
                    .attr("font-family", "akkurat")
                    .attr("font-size", "24px")
                    .attr("fill", "black")
                    .attr("id", "ballot")

      // make three columns of circles, from middle, left, right
      var box = [...Array(3).keys()]
      svg.selectAll("boxes").data(box).enter().append("circle")
        .attr("cx", width/4 + width/25).attr("cy", function(d,i){return width/4 + 3*width/32 + i*width/20})
        .attr("r", width/80).attr("fill", "#C4C4C4").attr("id", "boxes")
      svg.selectAll("boxes").data(box).enter().append("circle")
        .attr("cx", width/4).attr("cy", function(d,i){return width/4 + 3*width/32 + i*width/20})
        .attr("r", width/80).attr("fill", "#C4C4C4").attr("id", "boxes")
      svg.selectAll("boxes").data(box).enter().append("circle")
        .attr("cx", width/4 + 2*width / 25).attr("cy", function(d,i){return width/4 + 3*width/32 + i*width/20})
        .attr("r", width/80).attr("fill", "#C4C4C4").attr("id", "boxes")
      
        var cand = ["Rodrigo Red", "Belinda Blue", "Gracey Grey"]
      svg.selectAll("cand").data(cand).enter().append("text")
                    .attr("x", width/4 + width/9)
                    .attr("y", function(d,i){return width/4 + 3*width/32 + 5+ i*width/20})
                    .text(function(d, i){return d})
                    .attr("font-family", "akkurat")
                    .attr("font-size", "16px")
                    .attr("fill", "black")
                    .attr("id", function(d, it) {return "cand"});

      this.rcvballotToDot(0, width, svg, 1500, 1500);
      this.setState({svg: svg});
    }

  }

  sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

  ballotToDot = (index, width, svg, wait, speed) => {
    //var svg = this.state.svg;
    var rng = Math.floor(Math.random()*12)
    var color = ""
    var cand = 0
    var cand_id = ""
    if (rng < 2) {
      color = "#2994D2"
      cand = 1
      cand_id = "blue"
    } else if (rng < 7) {
      color = "#34495D"
      cand = 2
      cand_id = "grey"
    } else {
      color = "#ED4F3A"
      cand = 0
      cand_id = "red"
    }
    var vote = svg.append("circle")
                 .attr("cx", width/4 + width/25).attr("cy", width/4 + 3*width/32 + cand*width/20)
                 .attr("r", width/80).attr("fill", color).attr("id", cand_id)

    vote.transition()
        .duration(speed)
        .attr("cx", 3*width/4)
        .attr("cy", 30 + index*15)
        .attr("r", 6)

    this.setState({svg: svg});
    if (index < 25 && this.state.progress < 1) {
      if (wait != 0) {
        this.sleep(speed).then(() => {
          if (index == 2) {
            wait = 0
          }
          this.ballotToDot(index+1, width, svg, wait, speed)
        })

      } else {
        this.ballotToDot(index+1, width, svg, wait, speed)

      }
    }
    this.setState({svg: svg});

  }
  
  rcvballotToDot = (index, width, svg, wait, speed) => {
    //var svg = this.state.svg;
    var rng = Math.floor(Math.random()*12)
    var color = ""
    var cand = 0
    var cand_id = ""
    
    var c2 = ""
    var cn2 = 0
    var cid2 = ""

    var c3 = ""
    var cn3 = 0
    var cid3 = ""

    if (rng < 2) {
      color = "#2994D2"
      cand = 1
      cand_id = "blue"

      c2 = "#34495D"
      cn2 = 2
      cid2 = "grey"

      c3 = "#ED4F3A"
      cn3 = 0
      cid3 = "red"
    } else if (rng < 7) {
      color = "#34495D"
      cand = 2
      cand_id = "grey"

      c2 = "#ED4F3A"
      cn2 = 0
      cid2 = "red"

      c3 = "#2994D2"
      cn3 = 1
      cid3 = "blue"
    } else {
      color = "#ED4F3A"
      cand = 0
      cand_id = "red"

      c2 = "#34495D"
      cn2 = 2
      cid2 = "grey"

      c3 = "#2994D2"
      cn3 = 1
      cid3 = "blue"
    }

    var vote = svg.append("circle")
                 .attr("cx", width/4 ).attr("cy", width/4 + 3*width/32 + cand*width/20)
                 .attr("r", width/80).attr("fill", color).attr("id", cand_id)

    var vote2 = svg.append("circle")
                 .attr("cx", width/4 + width/25).attr("cy", width/4 + 3*width/32 + cn2*width/20)
                 .attr("r", width/80).attr("fill", c2).attr("id", cid2)

    var vote3 = svg.append("circle")
                 .attr("cx", width/4 + 2*width/25).attr("cy", width/4 + 3*width/32 + cn3*width/20)
                 .attr("r", width/80).attr("fill", c3).attr("id", cid3)

    this.sleep(speed*3);

    vote.transition()
        .duration(speed)
        .attr("cx", 3*width/4)
        .attr("cy", 30 + index*15)
        .attr("r", 6)
    vote2.transition()
         .duration(speed)
         .attr("cx", 3*width/4+ width/25)
         .attr("cy", 30 + index*15)
         .attr("r", 6)
    vote3.transition()
         .duration(speed)
         .attr("cx", 3*width/4+2*width/25)
         .attr("cy", 30 + index*15)
         .attr("r", 6)

    this.setState({svg: svg});
    if (index < 25 && this.state.progress < 23) {
      if (wait != 0) {
        this.sleep(speed).then(() => {
          if (index == 2) {
            wait = 0
          }
          this.rcvballotToDot(index+1, width, svg, wait, speed)
        })

      } else {
        this.rcvballotToDot(index+1, width, svg, wait, speed)

      }
    }
    this.setState({svg: svg});

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
    this.setState({width, height})

    // Get a handle on the SVG
    var svg = d3.select("#viz")
                .append('svg')
                .attr('width', width)
                .attr('height', height);

    // Initialize the ballot SVG
    svg.append("rect").attr("x", width/4).attr("y", width/4).attr("width", width/4).attr("height", width/4).style("fill", "#F4F4F4");
    var text = svg.append("text")
                  .attr("x", 10.3*width/32)
                  .attr("y", width/4 + 30)
                  .text("Ballot")
                  .attr("font-family", "akkurat")
                  .attr("font-size", "24px")
                  .attr("fill", "black")
                  .attr("id", "ballot")
    var box = [...Array(3).keys()]
    svg.selectAll("boxes").data(box).enter().append("circle")
       .attr("cx", width/4 + width/25).attr("cy", function(d,i){return width/4 + 3*width/32 + i*width/20})
       .attr("r", width/80).attr("fill", "#C4C4C4").attr("id", "boxes")
    var cand = ["Rodrigo Red", "Belinda Blue", "Gracey Grey"]
    svg.selectAll("cand").data(cand).enter().append("text")
                  .attr("x", width/4 + width/14)
                  .attr("y", function(d,i){return width/4 + 3*width/32 + 5+ i*width/20})
                  .text(function(d, i){return d})
                  .attr("font-family", "akkurat")
                  .attr("font-size", "16px")
                  .attr("fill", "black")
                  .attr("id", function(d, it) {return "cand"});


    // ballot to dot transformation
    this.setState({initialized: true, svg: svg});

    if (this.state.data == "") {
      this.ballotToDot(0, width, svg, 1500, 1500);
    }

    console.log("initialized")
    this.setState({svg: svg});

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
