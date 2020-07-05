/** @jsx jsx */
import React, { Component } from 'react';
import { css, jsx } from '@emotion/core';
import { Card } from "react-bootstrap";
import { Scrollama, Step } from 'react-scrollama';
import { select, selectAll, mouse } from 'd3-selection';
import { csv } from 'd3-fetch';
import { path } from 'd3-path';
import { scaleOrdinal } from 'd3-scale';
import { transition } from 'd3-transition';
import { nest } from 'd3-collection';
import Polarization from "../viz/Polarization"
import Strategic from "../viz/Strategic"
const descriptions = require("../assets/data/narrative.json");


const d3 = { select, selectAll, mouse, csv, path, scaleOrdinal, transition,
         nest };

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

  .card-text {
    font-size: 18px !important;
    line-height: 1.3;
  }
  .step {
    margin-right: 50px;
    padding-top: 200px;
    padding-bottom: 200px;
    '&:last-child': {
      margin-bottom: 0;
    }
    font-size: 20px;
  }
  .blurb {
    margin: 10%;
    margin-top: 3%;
    text-align: center;
    font-size: 24px;
    min-height: 100%;
  }
  .desc {
    margin-left:20px;
    margin-right:20px;
  }
  .btn {
    color: #575757;
  }
  #toc {
    font-size: 25px;
  }
  #tocl {
    margin-left: 0.8%;
  }
  .card-text-s {
    padding: 10%;
    font-size: 24px !important;
  }
`
;

const methodblurb = (
  <div>
    <left>
    <p>
    <b>First Past The Post is the main voting system of the U.S.</b>
    </p>
    <br></br>
    <p>
    Ranked Choice Voting is a popular alternative used in Australia, Maine, and some Californian cities.
    </p>
    <br></br>
    <p>
    We're going to illustrate how each method works, as well as their relative benefits and drawbacks.
    </p>
    </left>
  </div>
);

const polarizeblurb = (
  <div>
    <left>
    <p>
    First past the post encourages a two-party system and the polarization of candidate ideologies.
    </p>
    <br></br>
    <p>
    RCV can encourage more moderate candidates and can better support smaller parties and a multi-party system.
    </p>
    <br></br>
    <p>
    These are not universal laws but common trends.
    </p>
    <br></br>
    <p>
    We'll demonstrate these phenomena below.
    </p>
    </left>
  </div>
);

const strategicblurb = (
  <div>
    <left>
    <p>
      FPTP voting systems can encourage strategic voting as supporters of less popular candidates shift their vote to their more preferred of the most popular candidates, as opposed to their true first preference.
    </p>
    <br></br>
    <p>
      RCV voting systems allow voters to fully express all preferences without worrying about splitting the vote. Strategic voting in RCV can occur where voters rank major candidates who might contend against their favorite candidate as last, but even in these cases, a more moderate candidate is chosen.
    </p>
    <br></br>
    <p>
    Let’s take a closer look at both scenarios.
    </p>
    </left>
  </div>
);

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
    //element.style.backgroundColor = 'lightgoldenrodyellow';
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
  
  initializeBallot() {
    var svg = this.state.svg;
    var width = this.state.width
    svg.append("rect").attr("x", width/4).attr("y", width/4).attr("width", width/4).attr("height", width/4).style("fill", "#F4F4F4");
    svg.append("text")
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
    svg.selectAll(".cand").data(cand).enter().append("text")
                  .attr("x", width/4 + width/14)
                  .attr("y", function(d,i){return width/4 + 3*width/32 + 5+ i*width/20})
                  .text(function(d, i){return d})
                  .attr("font-family", "akkurat")
                  .attr("font-size", "16px")
                  .attr("fill", "black")
                  .attr("id", function(d, it) {return "cand"})
                  .attr("class", "cand")
    this.setState({svg});
  }

  fptpSetup = (svg, delay, winner) => {
    var width = this.state.width;
    var ballots = [0, 1, 2, 2, 2, 0, 1, 1, 2,
      2, 0, 2, 2, 0, 0, 0, 1, 0,
      2, 2, 2, 1, 0, 0, 1]

    svg.selectAll("votes").data(ballots).enter().append("circle")
    .attr("cx", 3*width/4)
    .attr("cy", function(d,i){return 30 + i*15})
    .attr("r", width/80)
    .attr("fill", 
    function(d, i) {
      if (d === 0) {
        return "#ED4F3A"
      } else if (d === 1) {
        return "#2994D2"
      } else {
        return "#34495D"
      }
      })
    .attr("id",
    function(d, i) {
      if (d === 0) {
        return "red"
      } else if (d === 1) {
        return "blue"
      } else {
        return "grey"
      }
    });
    let del1, del2;
    if (delay) {
      del1 = 1500;
      del2 = 200;
    } else {
      del1 = 0;
      del2 = 0;
    }

    svg.selectAll("circle")
      .transition()
      .duration(del1)
      .attr("cx", 10)
      .attr("cy", function(d, i) {return 50 + i*15})
      .attr("r", 6)

    this.sleep(del2).then(() => {
      var ax = [...Array(1).keys()]
      svg.selectAll("#axis").data(ax).enter().append("line")
                    .attr("x1", 3*width/4)
                    .attr("y1", 50)
                    .attr("x2", 3*width/4)
                    .attr("y2", 50 + 25*15)
                    .attr("stroke-width", 1.5)
                    .attr("stroke", "black")
                    .attr("id", "axis")

      var cand = ["Rodrigo Red", "Belinda Blue", "Gracey Grey"]
      svg.selectAll(".candName").data(cand).enter().append("text")
                    .attr("x", 3*width/4 + 10)
                    .attr("y", function(d,i){return 200 + 30*i})
                    .text(function(d, i){return d})
                    .attr("font-family", "akkurat")
                    .attr("font-size", "16px")
                    .attr("fill", "black")
                    .attr("id", function(d, i) {return "cand".concat(i.toString())})
                    .attr("class", "candName")
                    .attr("font-weight", function(d, i) {
                      if (winner && i === 2) {
                        return 900;
                      }
                      else {
                        return 100;
                      }
                    })

    });
    this.setState({svg});

  }

  fptpTransition = (svg, delay) => {
    var width = this.state.width;
    var red = svg.selectAll("#red");
    var blue = svg.selectAll("#blue");
    var grey = svg.selectAll("#grey");
    let del;
    if (delay) {
      del = 1500;
    } else {
      del = 0;
    }
    red.transition()
      .duration(del)
      .attr("cx", function(d, i) {return 3*width/4 - 15 - 15*i})
      .attr("cy", 195)
      .attr("r", 6)

    blue.transition()
        .duration(del)
        .attr("cx", function(d, i) {return 3*width/4 - 15 - 15*i})
        .attr("cy", 225)
        .attr("r", 6)

    grey.transition()
        .duration(del)
        .attr("cx", function(d, i) {return 3*width/4 - 15 - 15*i})
        .attr("cy", 255)
        .attr("r", 6)
    this.setState({svg})
  }

  rcvBallot = (svg) => {
    var width = this.state.width;

    svg.append("rect").attr("x", width/4-width/24).attr("y", width/4-width/100).attr("width", width/3).attr("height", width/4).style("fill", "#F4F4F4");
    svg.append("text")
      .attr("x", 10.3*width/32)
      .attr("y", width/4+25)
      .text("Ballot")
      .attr("font-family", "akkurat")
      .attr("font-size", "24px")
      .attr("fill", "black")
      .attr("id", "ballot")

    var boxlabels = ["3", "2", "1"]
    svg.selectAll(".boxlabels").data(boxlabels).enter().append("text")
                  .attr("x", function(d,i){return width/4 + i*width/25 - width/128})
                  .attr("y", width/4 + 9*width/128)
                  .text(function(d, i){return d})
                  .attr("font-family", "akkurat")
                  .attr("font-size", "14px")
                  .attr("fill", "black")
                  .attr("id", function(d, it) {return "boxlabel"})
                  .attr("class", "boxlabels")

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
    svg.selectAll(".cand").data(cand).enter().append("text")
                  .attr("x", width/4 + width/9)
                  .attr("y", function(d,i){return width/4 + 3*width/32 + 5+ i*width/20})
                  .text(function(d, i){return d})
                  .attr("font-family", "akkurat")
                  .attr("font-size", "16px")
                  .attr("fill", "black")
                  .attr("id", function(d, it) {return "cand"})
                  .attr("class", "cand")
    
    this.setState({svg});

  }

  rcvTransition = (svg, delay, remove) => {
    var width = this.state.width;

    let del1, del2;
    if (delay) {
      del1 = 1500;
      del2 = 200;
    } else {
      del1 = 0;
      del2 = 0;
    }

    svg.selectAll(".v3")
        .transition()
        .duration(del1)
        .attr("cx", width/25)
        .attr("cy", function(d, i) {return 50 + i*15})
        .attr("r", 6)
      svg.selectAll(".v2")
        .transition()
        .duration(del1)
        .attr("cx", 2*width/25)
        .attr("cy", function(d, i) {return 50 + i*15})
        .attr("r", 6)
      svg.selectAll(".v1")
        .transition()
        .duration(del1)
        .attr("cx", 3*width/25)
        .attr("cy", function(d, i) {return 50 + i*15})
        .attr("r", 6)

      svg.selectAll(".v1shadow")
        .transition()
        .attr("cx", 3*width/25)
        .attr("cy", function(d, i) {return 50 + i*15})
        .attr("r", 6)

      svg.selectAll(".v2shadow")
        .transition()
        .attr("cx", 2*width/25)
        .attr("cy", function(d, i) {return 50 + i*15})
        .attr("r", 6)

      this.sleep(del2).then(() => {
        var ax = [...Array(1).keys()]
        svg.selectAll("#axis").data(ax).enter().append("line")
                      .attr("x1", 3*width/4)
                      .attr("y1", 50)
                      .attr("x2", 3*width/4)
                      .attr("y2", 50 + 25*15)
                      .attr("stroke-width", 1.5)
                      .attr("stroke", "black")
                      .attr("id", "axis")

        var cand = ["Rodrigo Red", "Belinda Blue", "Gracey Grey"]
        svg.selectAll(".candName").data(cand).enter().append("text")
                      .attr("x", 3*width/4 + 10)
                      .attr("y", function(d,i){return 200 + 30*i})
                      .text(function(d, i){return d})
                      .attr("font-family", "akkurat")
                      .attr("font-size", "16px")
                      .attr("fill", "black")
                      .attr("id", function(d, i) {return "cand".concat(i.toString())})
                      .attr("class", "candName")
                      .attr("hidden", function(d, i) {if (remove && i === 1) {return true} else {return null}});

      })
    this.setState({svg});
  }

  rcvSecond = (svg, delay) => {

    var width = this.state.width;
    var red = svg.selectAll("#red.v1");
    var blue = svg.selectAll("#blue.v1");
    var grey = svg.selectAll("#grey.v1");

    svg.selectAll(".v1shadow")
        .transition(function(d, i) {return 50 + i*15})

    let del;
    if (delay) {
      del = 2000;
    } else {
      del = 0;
    }
    red.transition()
      .duration(del)
      .attr("cx", function(d, i) {return 3*width/4 - 15 - 15*i})
      .attr("cy", 195)
      .attr("r", 6)

    blue.transition()
        .duration(del)
        .attr("cx", function(d, i) {return 3*width/4 - 15 - 15*i})
        .attr("cy", 225)
        .attr("r", 6)

    grey.transition()
        .duration(del)
        .attr("cx", function(d, i) {return 3*width/4 - 15 - 15*i})
        .attr("cy", 255)
        .attr("r", 6)

    svg.selectAll(".v1shadow")
        .attr("opacity", 1)
    this.setState({redSize: red.size(), blueSize: blue.size(), greySize: grey.size()});
    this.setState({svg});
  }



  update() {
    console.log('updating');


    var svg = this.state.svg;
    var width = this.state.width;

    if (this.state.data === "0") {
      // Initialize the ballot SVG
      d3.selectAll("svg > *").remove();
      this.initializeBallot();
    }

    if (this.state.data === "1") {
      d3.selectAll("svg > *").remove();
      this.initializeBallot();

      var vote = svg.append("circle")
                  .attr("cx", width/4 + width/25).attr("cy", width/4 + 3*width/32)
                  .attr("r", width/80).attr("fill", "#ED4F3A").attr("id","red")

      vote.transition()
          .duration(1500)
          .attr("cx", 3*width/4)
          .attr("cy", 30)
          .attr("r", 6)
      this.setState({svg: svg});

    }

    if (this.state.data === "1.5") {
      d3.selectAll("svg > *").remove();
      this.initializeBallot();

      var vote = svg.append("circle")
                  .attr("cx", 3*width/4).attr("cy", 30)
                  .attr("r", 6).attr("fill", "#ED4F3A").attr("id","red1")

      var ballots = [1, 2, 2, 2, 0, 1, 1, 2,
        2, 0, 2, 2, 0, 0, 0, 1, 0,
        2, 2, 2, 1, 0, 0, 1]
      this.ballotToDot(1, width, svg, 1500, 1500, ballots);
      this.setState({svg});
    }

    if (this.state.data === "2") {
      d3.selectAll("svg > *").remove();
      this.fptpSetup(svg, true, false);
    }

    if (this.state.data === "2.5") {
      d3.selectAll("svg > *").remove();
      this.fptpSetup(svg, false, false);
      this.fptpTransition(svg, true);

    }

    if (this.state.data === "3")
    {
      d3.selectAll("svg > *").remove();
      this.fptpSetup(svg, false, true);
      this.fptpTransition(svg, false);
      this.setState({svg});
    }

    if (this.state.data === "4") {
      // remove stuff
      d3.selectAll("svg > *").remove();
      this.rcvBallot(svg);

    }

    if (this.state.data === "5") {
      
      d3.selectAll("svg > *").remove();
      this.rcvBallot(svg);

      var ballots = [[0, 2, 1], [1, 0, 2], [2, 0, 1], [2, 0, 1], [2, 1, 0], [0, 2, 1],
                     [1, 2, 0], [1, 0, 2], [2, 1, 0], [2, 0, 1], [0, 1, 2], [2, 1, 0],
                     [2, 0, 1], [0, 2, 1], [0, 2, 1], [0, 2, 1], [1, 0, 2], [0, 2, 1],
                     [2, 0, 1], [2, 1, 0], [2, 1, 0], [1, 0, 2], [0, 2, 1], [0, 1, 2], [1, 0, 2]]
      this.rcvballotToDot(0, width, svg, 1500, 1500, ballots);
      this.setState({svg: svg});
    }

    if (this.state.data === "6") {
      d3.selectAll("svg > *").remove();
      var ballots = [[0, 2, 1], [1, 0, 2], [2, 0, 1], [2, 0, 1], [2, 1, 0], [0, 2, 1],
                     [1, 2, 0], [1, 0, 2], [2, 1, 0], [2, 0, 1], [0, 1, 2], [2, 1, 0],
                     [2, 0, 1], [0, 2, 1], [0, 2, 1], [0, 2, 1], [1, 0, 2], [0, 2, 1],
                     [2, 0, 1], [2, 1, 0], [2, 1, 0], [1, 0, 2], [0, 2, 1], [0, 1, 2], [1, 0, 2]]
      this.rcvballotToDot(0, width, svg, 0, 0, ballots);
      this.rcvTransition(svg, true, false);

    }

    if (this.state.data === "7") {
      // var v1s = svg.selectAll(".v1");
      d3.selectAll("svg > *").remove();
      var ballots = [[0, 2, 1], [1, 0, 2], [2, 0, 1], [2, 0, 1], [2, 1, 0], [0, 2, 1],
                     [1, 2, 0], [1, 0, 2], [2, 1, 0], [2, 0, 1], [0, 1, 2], [2, 1, 0],
                     [2, 0, 1], [0, 2, 1], [0, 2, 1], [0, 2, 1], [1, 0, 2], [0, 2, 1],
                     [2, 0, 1], [2, 1, 0], [2, 1, 0], [1, 0, 2], [0, 2, 1], [0, 1, 2], [1, 0, 2]]
      this.rcvballotToDot(0, width, svg, 0, 0, ballots);
      this.rcvTransition(svg, false, false);
      this.rcvSecond(svg, true);

    }

    if (this.state.data === "8") {
      d3.selectAll("svg > *").remove();
      var ballots = [[0, 2, 1], [1, 0, 2], [2, 0, 1], [2, 0, 1], [2, 1, 0], [0, 2, 1],
                     [1, 2, 0], [1, 0, 2], [2, 1, 0], [2, 0, 1], [0, 1, 2], [2, 1, 0],
                     [2, 0, 1], [0, 2, 1], [0, 2, 1], [0, 2, 1], [1, 0, 2], [0, 2, 1],
                     [2, 0, 1], [2, 1, 0], [2, 1, 0], [1, 0, 2], [0, 2, 1], [0, 1, 2], [1, 0, 2]]
      this.rcvballotToDot(0, width, svg, 0, 0, ballots);
      this.rcvTransition(svg, false, true);
      this.rcvSecond(svg, false);

      svg.selectAll("#blue.v1").remove()
      svg.select("#cand1").remove()
    }

    if (this.state.data === "9") {
      d3.selectAll("svg > *").remove();
      var ballots = [[0, 2, 1], [1, 0, 2], [2, 0, 1], [2, 0, 1], [2, 1, 0], [0, 2, 1],
                     [1, 2, 0], [1, 0, 2], [2, 1, 0], [2, 0, 1], [0, 1, 2], [2, 1, 0],
                     [2, 0, 1], [0, 2, 1], [0, 2, 1], [0, 2, 1], [1, 0, 2], [0, 2, 1],
                     [2, 0, 1], [2, 1, 0], [2, 1, 0], [1, 0, 2], [0, 2, 1], [0, 1, 2], [1, 0, 2]]
      this.rcvballotToDot(0, width, svg, 0, 0, ballots);
      this.rcvTransition(svg, false, true);
      this.rcvSecond(svg, false);

      svg.selectAll("#blue.v1").remove()
      svg.select("#cand1").remove()

      svg.selectAll(".v2shadow")
         .attr("opacity", 1)

      svg.selectAll("[firstvote=v1blue]")
         .transition()
         .duration(1000)
         .attr("cx",  3*width/25)
         .attr("r", 6)
      this.setState({svg});
    }
    if (this.state.data === "10") {
      d3.selectAll("svg > *").remove();
      var ballots = [[0, 2, 1], [1, 0, 2], [2, 0, 1], [2, 0, 1], [2, 1, 0], [0, 2, 1],
                     [1, 2, 0], [1, 0, 2], [2, 1, 0], [2, 0, 1], [0, 1, 2], [2, 1, 0],
                     [2, 0, 1], [0, 2, 1], [0, 2, 1], [0, 2, 1], [1, 0, 2], [0, 2, 1],
                     [2, 0, 1], [2, 1, 0], [2, 1, 0], [1, 0, 2], [0, 2, 1], [0, 1, 2], [1, 0, 2]]
      this.rcvballotToDot(0, width, svg, 0, 0, ballots);
      this.rcvTransition(svg, false, true);
      this.rcvSecond(svg, false);

      svg.selectAll("#blue.v1").remove()
      svg.select("#cand1").remove()

      svg.selectAll(".v2shadow")
         .attr("opacity", 1)

      svg.selectAll("[firstvote=v1blue]")
         .transition()
         .duration(1000)
         .attr("cx",  3*width/25)
         .attr("r", 6)

      var redSize = this.state.redSize
      var greySize = this.state.greySize
      svg.selectAll("#red[firstvote=v1blue]")
         .transition()
         .duration(1500)
         .attr("cx", function(d, i) {return 3*width/4 - 15 - 15*i - 15*redSize})
         .attr("cy", 195)
         .attr("r", 6)

      svg.selectAll("#grey[firstvote=v1blue]")
         .transition()
         .duration(1500)
         .attr("cx", function(d, i) {return 3*width/4 - 15 - 15*i - 15*greySize})
         .attr("cy", 255)
         .attr("r", 6)


      this.sleep(1000).then(() => {
        svg.select("#cand2")
           .transition()
           .attr("font-weight", 100)
        svg.select("#cand0")
           .transition(100)
           .attr("font-weight", 900)
      })

    }
  }

  sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

  ballotToDot = (index, width, svg, wait, speed, ballots) => {
    //var svg = this.state.svg;
    var cand = ballots[index]
    var color = ""
    var cand_id = ""
    if (cand === 1) {
      color = "#2994D2"
      cand_id = "blue"
    } else if (cand === 2) {
      color = "#34495D"
      cand_id = "grey"
    } else {
      color = "#ED4F3A"
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

    if (index < 23) {
      this.ballotToDot(index+1, width, svg, wait, speed, ballots)
    }
    this.setState({svg: svg});

  }

  rcvballotToDot = (index, width, svg, wait, speed, ballots) => {
    //var svg = this.state.svg;
    var cols = ["#ED4F3A", "#2994D2", "#34495D"]
    var cand_ids = ["red", "blue", "grey"]
    var cand = ballots[index]
    var cand_id = [cand_ids[cand[0]], cand_ids[cand[1]], cand_ids[cand[2]]]
    var color = [cols[cand[0]], cols[cand[1]], cols[cand[2]]]

    var vote3 = svg.append("circle")
                   .attr("cx", width/4 ).attr("cy", width/4 + 3*width/32 + cand[2]*width/20)
                   .attr("r", width/80).attr("fill", color[2]).attr("id", cand_id[2]).attr("class", "v3")
    // v1 shadows
    svg.append("circle")
       .attr("cx", width/4 + 2*width/25).attr("cy", width/4 + 3*width/32 + cand[0]*width/20)
       .attr("r", width/80).attr("fill", "#C4C4C4").attr("id", cand_id[0]).attr("class", "v1shadow")
       .attr("opacity", 0)

    var vote1 = svg.append("circle")
                   .attr("cx", width/4 + 2*width/25).attr("cy", width/4 + 3*width/32 + cand[0]*width/20)
                   .attr("r", width/80).attr("fill", color[0]).attr("id", cand_id[0]).attr("class", "v1")

    // v2 shadows
    svg.append("circle")
       .attr("cx", width/4 + width/25).attr("cy", width/4 + 3*width/32 + cand[0]*width/20)
       .attr("r", width/80).attr("fill", "#C4C4C4").attr("id", cand_id[1]).attr("class", "v2shadow")
       .attr("opacity", 0)

    var vote2 = svg.append("circle")
                   .attr("cx", width/4 + width/25).attr("cy", width/4 + 3*width/32 + cand[1]*width/20)
                   .attr("r", width/80).attr("fill", color[1])
                   .attr("id", cand_id[1])
                   .attr("class", "v2")
                   .attr("firstvote", function(d,i) { return "v1" + cand_id[0]})

    this.sleep(speed*3);

    vote3.transition()
        .duration(speed)
        .attr("cx", 3*width/4)
        .attr("cy", 30 + index*15)
        .attr("r", 6)
    vote2.transition()
         .duration(speed)
         .attr("cx", 3*width/4+ width/25)
         .attr("cy", 30 + index*15)
         .attr("r", 6)
    vote1.transition()
         .duration(speed)
         .attr("cx", 3*width/4+2*width/25)
         .attr("cy", 30 + index*15)
         .attr("r", 6)

    this.setState({svg: svg});
    if (index < 24) {
        this.rcvballotToDot(index+1, width, svg, wait, speed, ballots)
 
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

    // // Initialize the ballot SVG
    // svg.append("rect").attr("x", width/4).attr("y", width/4).attr("width", width/4).attr("height", width/4).style("fill", "#F4F4F4");
    // svg.append("text")
    //    .attr("x", 10.3*width/32)
    //    .attr("y", width/4 + 30)
    //    .text("Ballot")
    //    .attr("font-family", "akkurat")
    //    .attr("font-size", "24px")
    //    .attr("fill", "black")
    //    .attr("id", "ballot")
    // var box = [...Array(3).keys()]
    // svg.selectAll("boxes").data(box).enter().append("circle")
    //    .attr("cx", width/4 + width/25).attr("cy", function(d,i){return width/4 + 3*width/32 + i*width/20})
    //    .attr("r", width/80).attr("fill", "#C4C4C4").attr("id", "boxes")
    // var cand = ["Rodrigo Red", "Belinda Blue", "Gracey Grey"]
    // svg.selectAll(".cand").data(cand).enter().append("text")
    //               .attr("x", width/4 + width/14)
    //               .attr("y", function(d,i){return width/4 + 3*width/32 + 5+ i*width/20})
    //               .text(function(d, i){return d})
    //               .attr("font-family", "akkurat")
    //               .attr("font-size", "16px")
    //               .attr("fill", "black")
    //               .attr("id", function(d, it) {return "cand"})
    //               .attr("class", "cand")


    // ballot to dot transformation
    this.setState({initialized: true, svg: svg});
  }

  // jumpLink(index) {
  //   //console.log('okthere')
  //   if (index === 0) {
  //     window.location.hash = "#methods"
  //     console.log("here")
  //   }
  //   if (index === 1) {
  //     window.location.hash = "#polarize"
  //   }
  //   if (index === 2) {
  //     window.location.hash = "#strategic"
  //   }
  //   // should call update wtih the appropriate paramters
  //   // so that we display the locations of "index"
  // }

  render() {
    const { data, value } = this.state;


    return (
      <div css={narrativeStyle}>
      <div className="blurb" id="methods">
        <Card>
          <div className="card-text-s">
            {methodblurb}
          </div>
        </Card>
      </div>
      <div className='main'>
        <div className='jumplinks' id="tocl">
          <b id="toc">Table of Contents</b>
          <br></br>
          <a href="#methods" style={{padding: "0%"}} class="btn btn-link">FPTP/RCV Explanations</a>
          <a href="#polarize" style={{padding: "0%"}} class="btn btn-link">Polarization/Two-Party</a>
          <a href="#strategic" style={{padding: "0%"}} class="btn btn-link">Strategic Voting</a>
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
                  <p className = "desc" id={"desc" + desc.key}>
                    <Card>
                      <Card.Body>
                        <Card.Text>{desc.description}</Card.Text>
                      </Card.Body>
                    </Card>
                  </p>
                </div>
              </Step>
            ))}
          </Scrollama>
         </div>
      </div>
      <div className="blurb" id="polarize">
        <Card>
          <div className="card-text-s">
            {polarizeblurb}
          </div>
        </Card>
      </div>
        <Polarization jumpLink/>
      <div className="blurb" id="strategic">
        <Card>
          <div className="card-text-s">
            {strategicblurb}
          </div>
        </Card>
      </div>
        <Strategic/>
      </div>
      )
  }
}
