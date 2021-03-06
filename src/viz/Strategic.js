/** @jsx jsx */
import React, { Component } from 'react';
import { css, jsx } from '@emotion/core';
import { Scrollama, Step } from 'react-scrollama';
import { Card } from "react-bootstrap";
import { select, selectAll, mouse } from 'd3-selection';
import { csv } from 'd3-fetch';
import { path } from 'd3-path';
import { scaleOrdinal } from 'd3-scale';
import { transition } from 'd3-transition';
import { nest } from 'd3-collection';
const descriptions = require("../assets/data/strategic.json");


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

  .graphic3 {
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

  .card-text {
    font-size: 18px !important;
    line-height: 1.3;
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
    font-size: 10px;
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
`
;


export default class Strategic extends Component {
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
      tealSize: 0,
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

  fptpBallot(winner) {
    var width = this.state.width;
    var svg = this.state.svg;
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
        .attr("font-weight", function(){if (winner) {return 900} else {return 100}})

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

    svg.append("text").text("Voters")
                      .attr("font-family", "akkurat")
                      .attr("font-size", "16px")
                      .attr("fill", "black")
                      .attr("id", "voterlabel2")
                      .attr("class", "voterlabel")
                      .attr("transform", "translate(25,240)rotate(-90)")

    var v =  [[0],[0],[0],[1],[1],[1],[0],[0],[1],[1],[0],[0],[1],[1],[1]]
    svg.selectAll("votes").data(v).enter().append("circle")
       .attr("cx", 2*width/25)
       .attr("cy", function(d,i){return 200 + i*15})
       .attr("r", 6)
       .attr("fill", function(d){return (d[0] === 1 ? "#ED4F3A" : "#34495D")})
       .attr("id", function(d) {return (d[0] === 1 ? 'red' : 'grey')})
       .attr("blue-detractor", function(d) {return (d[1] === 1 ? "true" : "false")})
       .attr("grey-detractor", function(d) {return (d[2] === 1 ? "true" : "false")})

    var blues = [[2],[2],[2],[2],[2],[2],[2],[2],[2],[2]]
    svg.selectAll("votes").data(blues).enter().append("circle")
       .attr("cx", 2*width/25)
       .attr("cy", function(d,i){return 50 + i*15})
       .attr("r", 6)
       .attr("fill", "#2994D2")
       .attr("id", "blue")

    // ballot to dot transformation
    this.setState({initialized: true, svg: svg});
  }

  fptpSetup = (svg, delay) => {
    var width = this.state.width;
    let del;
    if (delay) {
      del = 2000;
    } else {
      del = 0;
    }
    svg.selectAll("#red").transition()
                           .duration(del)
                           .attr("cx", function(d, i) {return 3*width/4 - 15 - 15*i})
                           .attr("cy", 300-5)
                           .attr("r", 6)
    svg.selectAll("#blue").transition()
                          .duration(del)
                          .attr("cx", function(d, i) {return 3*width/4 - 15 - 15*i})
                          .attr("cy", 150-5)
                          .attr("r", 6)
    svg.selectAll("#grey").transition()
                          .duration(del)
                          .attr("cx", function(d, i) {return 3*width/4 - 15 - 15*i})
                          .attr("cy", 330-5)
                          .attr("r", 6)
    this.setState({svg});
  }

  rcvBallot = svg => {
    var width = this.state.width;
    // Initialize the ballot SVG
    svg.append("rect").attr("x", width/4 - width/12).attr("y", width/4-2*width/100).attr("width", width/3+ width/12).attr("height", 12*width/40).style("fill", "#F4F4F4");
    svg.append("text")
       .attr("x", 10.3*width/32)
       .attr("y", width/4+20)
       .text("Ballot")
       .attr("font-family", "akkurat")
       .attr("font-size", "24px")
       .attr("fill", "black")
       .attr("id", "ballot")

    var boxlabels = ["4", "3", "2", "1"]
    svg.selectAll(".boxlabels").data(boxlabels).enter().append("text")
                              .attr("x", function(d,i){return width/4 - width/24 + i*width/25 - width/128})
                              .attr("y", width/4 + 9*width/128)
                              .text(function(d, i){return d})
                              .attr("font-family", "akkurat")
                              .attr("font-size", "14px")
                              .attr("fill", "black")
                              .attr("id", function(d, it) {return "boxlabel"})
                              .attr("class", "boxlabels")

    // make three columns of circles, from middle, left, right
    var box = [...Array(4).keys()]
    svg.selectAll("boxes").data(box).enter().append("circle")
       .attr("cx", width/4 - width/24 + width/25).attr("cy", function(d,i){return width/4 + 3*width/32 + i*width/20})
       .attr("r", width/80).attr("fill", "#C4C4C4").attr("id", "boxes")
    svg.selectAll("boxes").data(box).enter().append("circle")
       .attr("cx", width/4 - width/24).attr("cy", function(d,i){return width/4 + 3*width/32 + i*width/20})
       .attr("r", width/80).attr("fill", "#C4C4C4").attr("id", "boxes")
    svg.selectAll("boxes").data(box).enter().append("circle")
       .attr("cx", width/4 - width/24 + 2*width / 25).attr("cy", function(d,i){return width/4 + 3*width/32 + i*width/20})
       .attr("r", width/80).attr("fill", "#C4C4C4").attr("id", "boxes")
    svg.selectAll("boxes").data(box).enter().append("circle")
       .attr("cx", width/4 - width/24 + 3*width / 25).attr("cy", function(d,i){return width/4 + 3*width/32 + i*width/20})
       .attr("r", width/80).attr("fill", "#C4C4C4").attr("id", "boxes")

    var cand = ["Rodrigo Red", "Belinda Blue", "Gracey Grey", "Terrence Teal"]
    svg.selectAll(".cand").data(cand).enter().append("text")
                  .attr("x", width/4 + width/9)
                  .attr("y", function(d,i){return width/4 + 3*width/32 + 5+ (i)*width/20})
                  .text(function(d, i){return d})
                  .attr("font-family", "akkurat")
                  .attr("font-size", "16px")
                  .attr("fill", "black")
                  .attr("id", function(d, it) {return "cand"})
                  .attr("class", "cand")
    this.setState({svg});
  }
  
  rcvSetup = (svg, delay) => {
    var width = this.state.width;
    let del1, del2;
    if (delay) {
      del1 = 1500;
      del2 = 250;
    } else {
      del1 = 0;
      del2 = 0;
    }
    svg.selectAll(".v4")
    .transition()
    .duration(del1)
    .attr("cx", width/25)
    .attr("cy", function(d, i) {return 50 + i*15})
    .attr("r", 6)
    svg.selectAll(".v3")
      .transition()
      .duration(del1)
      .attr("cx", 2*width/25)
      .attr("cy", function(d, i) {return 50 + i*15})
      .attr("r", 6)
    svg.selectAll(".v2")
      .transition()
      .duration(del1)
      .attr("cx", 3*width/25)
      .attr("cy", function(d, i) {return 50 + i*15})
      .attr("r", 6)
    svg.selectAll(".v1")
      .transition()
      .duration(del1)
      .attr("cx", 4*width/25)
      .attr("cy", function(d, i) {return 50 + i*15})
      .attr("r", 6)

    svg.selectAll(".v1shadow")
      .transition()
      .duration(del1)
      .attr("cx", 4*width/25)
      .attr("cy", function(d, i) {return 50 + i*15})
      .attr("r", 6)

    svg.selectAll(".v2shadow")
      .transition()
      .duration(del1)
      .attr("cx", 3*width/25)
      .attr("cy", function(d, i) {return 50 + i*15})
      .attr("r", 6)

    svg.selectAll(".v3shadow")
      .transition()
      .duration(del1)
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

      var cand = ["Rodrigo Red", "Belinda Blue", "Gracey Grey", "Terrence Teal"]
      svg.selectAll(".candName").data(cand).enter().append("text")
                    .attr("x", 3*width/4 + 10)
                    .attr("y", function(d,i){return 200 + 30*i})
                    .text(function(d, i){return d})
                    .attr("font-family", "akkurat")
                    .attr("font-size", "16px")
                    .attr("fill", "black")
                    .attr("id", function(d, i) {return "cand".concat(i.toString())})
                    .attr("class", "candName")

    });

    this.setState({svg});
  }

  rcvCount = (svg, delay) => {
    var width = this.state.width;
    let del;
    if (delay) {
      del = 2000;
    } else {
      del = 0;
    }
    var red = svg.selectAll("#red.v1");
    var blue = svg.selectAll("#blue.v1");
    var grey = svg.selectAll("#grey.v1");
    var teal = svg.selectAll("#teal.v1");

    // svg.selectAll(".v1shadow")
    //    .transition(function(d, i) {return 50 + i*15})
    //    .duration(del)


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

    teal.transition()
        .duration(del)
        .attr("cx", function(d, i) {return 3*width/4 - 15 - 15*i})
        .attr("cy", 285)
        .attr("r", 6)

    svg.selectAll(".v1shadow")
       .attr("opacity", 1)

    this.setState({redSize: red.size(), blueSize: blue.size(), greySize: grey.size(), tealSize: teal.size()});
    this.setState({svg});
  }

  rcvStep15 = (svg, delay) => {
    var width = this.state.width;

    let del;
    if (delay) {
      del = 1000;
    } else {
      del = 0;
    }

    var ballots = [[0, 2, 3, 1], [0, 3, 2, 1], [0, 3, 2, 1], [1, 3, 2, 0], [1, 3, 2, 0],
                  [3, 0, 1, 2], [0, 2, 3, 1], [0, 2, 3, 1], [2, 3, 1, 0], [1, 3, 2, 0],
                  [1, 2, 3, 0], [2, 3, 1, 0], [0, 2, 3, 1], [0, 3, 2, 1], [2, 3, 1, 0],
                  [1, 3, 2, 0], [1, 2, 3, 0], [3, 2, 0, 1], [0, 3, 2, 1], [0, 2, 3, 1],
                  [2, 0, 3, 1], [1, 3, 2, 0], [3, 2, 0, 1], [3, 0, 2, 1], [3, 1, 0, 2]]

    this.rcvballotToDot(0, width, svg, 0, 0, ballots);
    this.rcvSetup(svg, false);
    this.rcvCount(svg, false);
    svg.selectAll("#grey.v1").remove();
    svg.selectAll(".v2shadow")
        .attr("opacity", 1);

    svg.selectAll("[firstvote=v1grey]")
        .transition()
        .duration(del)
        .attr("cx",  4*width/25)
        .attr("r", 6);

    this.setState({svg});
  }

  rcvStep16 = (svg, delay) => {
    var width = this.state.width;
    var redSize = this.state.redSize
    var tealSize = this.state.tealSize

    let del;
    if (delay) {
      del = 2000;
    } else {
      del = 0;
    }

    svg.selectAll("#red[firstvote=v1grey]")
        .transition()
        .duration(del)
        .attr("cx", function(d, i) {return 3*width/4 - 15 - 15*i - 15*redSize})
        .attr("cy", 195)
        .attr("r", 6)

    svg.selectAll("#teal[firstvote=v1grey]")
        .transition()
        .duration(del)
        .attr("cx", function(d, i) {return 3*width/4 - 15 - 15*i - 15*tealSize})
        .attr("cy", 285)
        .attr("r", 6)

    this.sleep(del).then(() => {
      svg.selectAll("#blue.v1").remove();
    });
    this.setState({svg});
  }

  rcvStep17 = (svg, delay) => {
    let del;
    if (delay) {
      del = 1000;
    } else {
      del = 0;
    }
    var width = this.state.width;
    svg.selectAll(".v3shadow")
           .attr("opacity", 1)

    svg.selectAll("#grey.v2[firstvote=v1blue]").remove()

    svg.selectAll("[firstvote=v1blue]")
        .transition()
        .duration(del)
        .attr("cx",  4*width/25)
        .attr("r", 6)
    this.setState({svg});
  }

  rcvStep18 = (svg, delay) => {
    var width = this.state.width;
    var tealSize = this.state.tealSize;
    let del;
    if (delay) {
      del = 2000;
    } else {
      del = 0;
    }

    svg.selectAll("#teal[firstvote=v1blue]")
        .transition()
        .duration(del)
        .attr("cx", function(d, i) {return 3*width/4 - 15 - 15*i - 15*(tealSize + 3)})
        .attr("cy", 285)
        .attr("r", 6)


    this.sleep(del).then(() => {
      svg.select("#cand0")
          .transition()
          .attr("font-weight", 100)
      svg.select("#cand3")
          .transition(100)
          .attr("font-weight", 900)
    });
    this.setState({svg});
  }

  update() {
    console.log('updating');


    var svg = this.state.svg;
    var width = this.state.width

    if (this.state.data === "0" || this.state.data === "1") {
      d3.selectAll("svg > *").remove();
      this.fptpBallot();
    }

    if (this.state.data === "2") {
      d3.selectAll("svg > *").remove();
      this.fptpBallot(false);
      this.fptpSetup(svg, true);
    }

    if (this.state.data === "3") {
      d3.selectAll("svg > *").remove();
      this.fptpBallot(true);
      this.fptpSetup(svg, false);
    }

    if (this.state.data === "4") {
      d3.selectAll("svg > *").remove();
      this.fptpBallot(true);
      this.fptpSetup(svg, false);
      svg.selectAll("#grey").transition()
                            .duration(2000)
                            .attr("cx", function(d, i) {return 3*width/4 - 15 -15*8 - 15*i})
                            .attr("fill", "#ED4F3A")
                            .attr("cy", 300-5)
                            .attr("r", 6)
    }

    if (this.state.data === "5") {
      d3.selectAll("svg > *").remove();
      this.fptpBallot(false);
      this.fptpSetup(svg, false);
      svg.selectAll("#grey").transition()
                            .duration(0)
                            .attr("cx", function(d, i) {return 3*width/4 - 15 -15*8 - 15*i})
                            .attr("fill", "#ED4F3A")
                            .attr("cy", 300-5)
                            .attr("r", 6)
      svg.select("#cand2")
           .transition(2000)
           .attr("font-weight", 100)
      svg.select("#cand0")
           .transition(2000)
           .attr("font-weight", 900)
    }

    if (this.state.data === "6") {
      svg.selectAll("*").remove()
    }

    if (this.state.data === "10") {
      svg.selectAll("*").remove()
      this.rcvBallot(svg);
    }

    if (this.state.data === "11") {
      svg.selectAll("*").remove()
      this.rcvBallot(svg);
      var ballots = [[0, 2, 3, 1], [0, 3, 2, 1], [0, 3, 2, 1], [1, 3, 2, 0], [1, 3, 2, 0],
                    [3, 0, 1, 2], [0, 2, 3, 1], [0, 2, 3, 1], [2, 3, 1, 0], [1, 3, 2, 0],
                    [1, 2, 3, 0], [2, 3, 1, 0], [0, 2, 3, 1], [0, 3, 2, 1], [2, 3, 1, 0],
                    [1, 3, 2, 0], [1, 2, 3, 0], [3, 2, 0, 1], [0, 3, 2, 1], [0, 2, 3, 1],
                    [2, 0, 3, 1], [1, 3, 2, 0], [3, 2, 0, 1], [3, 0, 2, 1], [3, 1, 0, 2]]

      this.rcvballotToDot(0, width, svg, 1500, 1500, ballots);
    }

    if (this.state.data === "12") {
      svg.selectAll("*").remove()
      var ballots = [[0, 2, 3, 1], [0, 3, 2, 1], [0, 3, 2, 1], [1, 3, 2, 0], [1, 3, 2, 0],
                    [3, 0, 1, 2], [0, 2, 3, 1], [0, 2, 3, 1], [2, 3, 1, 0], [1, 3, 2, 0],
                    [1, 2, 3, 0], [2, 3, 1, 0], [0, 2, 3, 1], [0, 3, 2, 1], [2, 3, 1, 0],
                    [1, 3, 2, 0], [1, 2, 3, 0], [3, 2, 0, 1], [0, 3, 2, 1], [0, 2, 3, 1],
                    [2, 0, 3, 1], [1, 3, 2, 0], [3, 2, 0, 1], [3, 0, 2, 1], [3, 1, 0, 2]]

      this.rcvballotToDot(0, width, svg, 0, 0, ballots);
      this.rcvSetup(svg, true);
    }

    if (this.state.data === "13") {
      svg.selectAll("*").remove()
      var ballots = [[0, 2, 3, 1], [0, 3, 2, 1], [0, 3, 2, 1], [1, 3, 2, 0], [1, 3, 2, 0],
                    [3, 0, 1, 2], [0, 2, 3, 1], [0, 2, 3, 1], [2, 3, 1, 0], [1, 3, 2, 0],
                    [1, 2, 3, 0], [2, 3, 1, 0], [0, 2, 3, 1], [0, 3, 2, 1], [2, 3, 1, 0],
                    [1, 3, 2, 0], [1, 2, 3, 0], [3, 2, 0, 1], [0, 3, 2, 1], [0, 2, 3, 1],
                    [2, 0, 3, 1], [1, 3, 2, 0], [3, 2, 0, 1], [3, 0, 2, 1], [3, 1, 0, 2]]

      this.rcvballotToDot(0, width, svg, 0, 0, ballots);
      this.rcvSetup(svg, false);
      this.rcvCount(svg, true);
    }

    if (this.state.data === "14") {
      svg.selectAll("*").remove()
      var ballots = [[0, 2, 3, 1], [0, 3, 2, 1], [0, 3, 2, 1], [1, 3, 2, 0], [1, 3, 2, 0],
                    [3, 0, 1, 2], [0, 2, 3, 1], [0, 2, 3, 1], [2, 3, 1, 0], [1, 3, 2, 0],
                    [1, 2, 3, 0], [2, 3, 1, 0], [0, 2, 3, 1], [0, 3, 2, 1], [2, 3, 1, 0],
                    [1, 3, 2, 0], [1, 2, 3, 0], [3, 2, 0, 1], [0, 3, 2, 1], [0, 2, 3, 1],
                    [2, 0, 3, 1], [1, 3, 2, 0], [3, 2, 0, 1], [3, 0, 2, 1], [3, 1, 0, 2]]

      this.rcvballotToDot(0, width, svg, 0, 0, ballots);
      this.rcvSetup(svg, false);
      this.rcvCount(svg, false);
      svg.selectAll("#grey.v1").remove();
    }

    if (this.state.data === "15") {
      svg.selectAll("*").remove()
      this.rcvStep15(svg, true);
    }

    if (this.state.data === "16") {
      svg.selectAll("*").remove()
      this.rcvStep15(svg, false);
      this.rcvStep16(svg, true);

    }

    if (this.state.data === "17") {
      svg.selectAll("*").remove()
      this.rcvStep15(svg, false);
      this.rcvStep16(svg, false);
      this.rcvStep17(svg, true);
    }

    if (this.state.data === "18") {
      svg.selectAll("*").remove()
      this.rcvStep15(svg, false);
      this.rcvStep16(svg, false);
      this.rcvStep17(svg, false);
      this.rcvStep18(svg, true);

    }

    if (this.state.data === "19") {
      svg.selectAll("*").remove()
      this.rcvStep15(svg, false);
      this.rcvStep16(svg, false);
      this.rcvStep17(svg, false);
      this.rcvStep18(svg, false);
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

    this.setState({svg: svg});
    if (index < 24) {
      if (wait !== 0) {
        this.sleep(speed).then(() => {
          if (index === 2) {
            wait = 0
          }
          this.ballotToDot(index+1, width, svg, wait, speed, ballots)
        })

      } else {
        this.ballotToDot(index+1, width, svg, wait, speed, ballots)

      }
    }
    this.setState({svg: svg});

  }

  rcvballotToDot = (index, width, svg, wait, speed, ballots) => {
    //var svg = this.state.svg;
    var cols = ["#ED4F3A", "#2994D2", "#34495D", "#78BEBE"]
    var cand_ids = ["red", "blue", "grey", "teal"]
    var cand = ballots[index]
    var cand_id = [cand_ids[cand[0]], cand_ids[cand[1]], cand_ids[cand[2]], cand_ids[cand[3]]]
    var color = [cols[cand[0]], cols[cand[1]], cols[cand[2]], cols[cand[3]]]

    // v1 shadows
    svg.append("circle")
       .attr("cx", width/4 + 2*width/25).attr("cy", width/4 + 3*width/32 + cand[0]*width/20)
       .attr("r", width/80).attr("fill", "#C4C4C4").attr("id", cand_id[0]).attr("class", "v1shadow")
       .attr("opacity", 0)

    var vote1 = svg.append("circle")
                   .attr("cx", width/4 + 2*width/25)
                   .attr("cy", width/4 + 3*width/32 + cand[0]*width/20)
                   .attr("r", width/80)
                   .attr("fill", color[0])
                   .attr("id", cand_id[0])
                   .attr("class", "v1")
                   .attr("firstvote", function(d,i) { return "v1" + cand_id[0]})

    // v2 shadows
    svg.append("circle")
       .attr("cx", width/4 + width/25).attr("cy", width/4 + 3*width/32 + cand[0]*width/20)
       .attr("r", width/80).attr("fill", "#C4C4C4").attr("id", cand_id[1]).attr("class", "v2shadow")
       .attr("opacity", 0)

    var vote2 = svg.append("circle")
                   .attr("cx", width/4 + width/25)
                   .attr("cy", width/4 + 3*width/32 + cand[1]*width/20)
                   .attr("r", width/80)
                   .attr("fill", color[1])
                   .attr("id", cand_id[1])
                   .attr("class", "v2")
                   .attr("firstvote", function(d,i) { return "v1" + cand_id[0]})

    // v3 shadows
    svg.append("circle")
       .attr("cx", width/4 ).attr("cy", width/4 + 3*width/32 + cand[0]*width/20)
       .attr("r", width/80).attr("fill", "#C4C4C4").attr("id", cand_id[2]).attr("class", "v3shadow")
       .attr("opacity", 0)

    var vote3 = svg.append("circle")
                   .attr("cx", width/4 )
                   .attr("cy", width/4 + 3*width/32 + cand[2]*width/20)
                   .attr("r", width/80)
                   .attr("fill", color[2])
                   .attr("id", cand_id[2])
                   .attr("class", "v3")
                   .attr("firstvote", function(d,i) { return "v3" + cand_id[2]})

    var vote4 = svg.append("circle")
                   .attr("cx", width/4 - width/25)
                   .attr("cy", width/4 + 3*width/32 + cand[3]*width/20)
                   .attr("r", width/80)
                   .attr("fill", color[3])
                   .attr("id", cand_id[3])
                   .attr("class", "v4")
                   .attr("firstvote", function(d,i) { return "v4" + cand_id[3]})

    this.sleep(speed*3);

    vote4.transition()
        .duration(speed)
        .attr("cx", 3*width/4 - width/25)
        .attr("cy", 30 + index*15)
        .attr("r", 6)
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

    if (index < 24) {
        this.rcvballotToDot(index+1, width, svg, wait, speed, ballots)
    }
    this.setState({svg: svg});

  }

  initialize() {
    // thanks xisabao
    var parentWidth = d3
      .select('.graphic3')
      .node()
      .getBoundingClientRect().width;


    const margin = { top: 0, right: 0, bottom: 0, left: 0 };

    const width = parentWidth - margin.left - margin.right;
    const height = 800 - margin.top - margin.bottom;
    this.setState({width, height})

    // Get a handle on the SVG
    var svg = d3.select("#viz3")
                .append('svg')
                .attr('width', width)
                .attr('height', height);
    this.setState({svg, width, height});
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
      <div id="methods"></div>
      <div className='main'>

        <div className='jumplinks' id="tocl">
          <b id="toc">Table of Contents</b>
          <br></br>
          <a href="#methods" style={{padding: "0%"}} class="btn btn-link">FPTP/RCV Explanations</a>
          <a href="#polarize" style={{padding: "0%"}} class="btn btn-link">Polarization/Two-Party</a>
          <a href="#strategic" style={{padding: "0%"}} class="btn btn-link">Strategic Voting</a>
        </div>
        <div className='graphic3'>
          <div id="viz3"></div>
        </div>
        <div id="polarize"></div>
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
      </div>
      )
  }
}
