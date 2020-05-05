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
      tealSize: 0,
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


      var blue = svg.selectAll("#blue")
      blue.transition()
        .duration(2000)
        .attr("cx", function(d, i) {return 3*width/4 - 15 - 15*i})
        .attr("cy", 175)
        .attr("r", 6)
      this.setState({blueSize: blue.size()})

      var red = svg.selectAll("#red[blue-detractor=false][grey-detractor=false]")
      red.transition()
        .duration(2000)
        .attr("cx", function(d, i) {return 3*width/4 - 15 - 15*i})
        .attr("cy", 135)
        .attr("r", 6)
      this.setState({redSize: red.size()})

      red = svg.selectAll("#red[blue-detractor=true][grey-detractor=false]")
      var redSize = this.state.redSize
      red.transition()
        .duration(2000)
        .attr("cx", function(d, i) {return 3*width/4 - 15 - 15*i - 15*redSize})
        .attr("cy", 135)
        .attr("r", 6)
      this.setState({redSize: redSize + red.size()})

      var grey = svg.selectAll("#grey")
      grey.transition()
        .duration(2000)
        .attr("cx", function(d, i) {return 3*width/4 - 15 - 15*i})
        .attr("cy", 295)
        .attr("r", 6)
      this.setState({greySize: grey.size()})

      var teal = svg.selectAll("#teal[grey-detractor=false][blue-detractor=false]")
      teal.transition()
        .duration(2000)
        .attr("cx", function(d, i) {return 3*width/4 - 15 - 15*i})
        .attr("cy", 335)
        .attr("r", 6)
      this.setState({tealSize: teal.size()})

      teal = svg.selectAll("#teal[grey-detractor=true][blue-detractor=false]")
      var tealSize = this.state.tealSize
      teal.transition()
        .duration(2000)
        .attr("cx", function(d, i) {return 3*width/4 - 15 - 15*i - 15*tealSize})
        .attr("cy", 335)
        .attr("r", 6)
      this.setState({tealSize: tealSize + teal.size()})

      this.sleep(2250).then(() => {
        svg.select("#cand2").attr("font-weight", 900)
      })
    }

    if (this.state.data === "2") {
      var red = svg.selectAll("#red[blue-detractor=true][grey-detractor=false]")
      var blueSize = this.state.blueSize
      red.transition()
        .duration(2000)
        .attr("fill", "#2994D2")
        .attr("cx", function(d, i) {return 3*width/4 - 15 - 15*i - 15*blueSize})
        .attr("cy", 175)
        .attr("r", 6)
      this.setState({blueSize: red.size() + blueSize})
    }

    if (this.state.data === "3") {
      var teal = svg.selectAll("#teal[blue-detractor=false][grey-detractor=true]")
      var greySize = this.state.greySize
      teal.transition()
        .duration(2000)
        .attr("fill", "#34495D")
        .attr("cx", function(d, i) {return 3*width/4 - 15 - 15*i - 15*greySize})
        .attr("cy", 295)
        .attr("r", 6)
      this.setState({greySize: teal.size() + greySize})
    }

    if (this.state.data === "4") {
      var blue = svg.selectAll("#red[blue-detractor=true][grey-detractor=false],#blue")
      //greySize = this.state.greySize
      blue.transition()
        .duration(2000)
        .attr("cy", 155)
        .attr("r", 6)

      svg.selectAll("#cand1").transition().duration(2000).attr("y", 160)

      var grey = svg.selectAll("#teal[blue-detractor=false][grey-detractor=true],#grey")
      //greySize = this.state.greySize
      grey.transition()
        .duration(2000)
        .attr("cy", 315)
        .attr("r", 6)

      svg.selectAll("#cand2").transition().duration(2000).attr("y", 320)


      this.sleep(2250).then(() => {
        var teal = svg.selectAll("#teal[blue-detractor=false][grey-detractor=false]")
        var greySize = this.state.greySize
        teal.transition()
          .duration(2000)
          .attr("fill", "#34495D")
          .attr("cx", function(d, i) {return 3*width/4 - 15 - 15*i - 15*greySize})
          .attr("cy", 315)
          .attr("r", 6)
        this.setState({greySize: teal.size() + greySize})

        var red = svg.selectAll("#red[blue-detractor=false][grey-detractor=false]")
        var blueSize = this.state.blueSize
        red.transition()
          .duration(2000)
          .attr("fill", "#2994D2")
          .attr("cx", function(d, i) {return 3*width/4 - 15 - 15*i - 15*blueSize})
          .attr("cy", 155)
          .attr("r", 6)
        this.setState({blueSize: red.size() + blueSize})

      })



    }

    if (this.state.data === "5") {
      svg.selectAll("#cand0,#cand3").remove()
    }

    if (this.state.data === "6") {
      svg.selectAll("*").remove()
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

      var cand = ["Rodrigo Red", "Belinda Blue", "Gracey Grey", "Terence Teal"]
      svg.selectAll(".cand").data(cand).enter().append("text")
                    .attr("x", width/4 + width/9)
                    .attr("y", function(d,i){return width/4 + 3*width/32 + 5+ (i)*width/20})
                    .text(function(d, i){return d})
                    .attr("font-family", "akkurat")
                    .attr("font-size", "16px")
                    .attr("fill", "black")
                    .attr("id", function(d, it) {return "cand"})
                    .attr("class", "cand")
    }

    if (this.state.data === "7") {

      var ballots = [[3, 2, 1, 0], [0, 1, 2, 3], [3, 2, 1, 0], [1, 0, 2, 3], [2, 3, 1, 0],
                    [2, 3, 1, 0], [2, 3, 0, 1], [1, 0, 3, 2], [2, 3, 1, 0], [0, 1, 3, 2], [1, 0, 2, 3],
                    [1, 0, 2, 3], [2, 3, 1, 0], [0, 1, 2, 3], [3, 2, 2, 0], [0, 1, 3, 2],
                    [2, 3, 1, 0], [3, 2, 0, 1], [1, 0, 2, 3], [2, 3, 1, 0], [1, 0, 2, 3],
                    [0, 1, 2, 3], [2, 3, 1, 0], [3, 2, 1, 0], [1, 0, 2, 3], [3, 2, 1, 0]]

      this.rcvballotToDot(0, width, svg, 1500, 1500, ballots);
    }

    if (this.state.data === "9") {
        svg.select("rect").remove()
        svg.select("#ballot").remove()
        svg.selectAll("#cand").remove()
        svg.selectAll("#boxes").remove()
        svg.selectAll(".boxlabels").remove()

        svg.selectAll(".v4")
          .transition()
          .duration(1500)
          .attr("cx", width/25)
          .attr("cy", function(d, i) {return 50 + i*15})
          .attr("r", 6)
        svg.selectAll(".v3")
          .transition()
          .duration(1500)
          .attr("cx", 2*width/25)
          .attr("cy", function(d, i) {return 50 + i*15})
          .attr("r", 6)
        svg.selectAll(".v2")
          .transition()
          .duration(1500)
          .attr("cx", 3*width/25)
          .attr("cy", function(d, i) {return 50 + i*15})
          .attr("r", 6)
        svg.selectAll(".v1")
          .transition()
          .duration(1500)
          .attr("cx", 4*width/25)
          .attr("cy", function(d, i) {return 50 + i*15})
          .attr("r", 6)

        svg.selectAll(".v1shadow")
          .transition()
          .attr("cx", 4*width/25)
          .attr("cy", function(d, i) {return 50 + i*15})
          .attr("r", 6)

        svg.selectAll(".v2shadow")
          .transition()
          .attr("cx", 3*width/25)
          .attr("cy", function(d, i) {return 50 + i*15})
          .attr("r", 6)

        svg.selectAll(".v3shadow")
          .transition()
          .attr("cx", 2*width/25)
          .attr("cy", function(d, i) {return 50 + i*15})
          .attr("r", 6)

        this.sleep(1500).then(() => {
          var ax = [...Array(1).keys()]
          svg.selectAll("#axis").data(ax).enter().append("line")
                        .attr("x1", 3*width/4)
                        .attr("y1", 50)
                        .attr("x2", 3*width/4)
                        .attr("y2", 50 + 25*15)
                        .attr("stroke-width", 1.5)
                        .attr("stroke", "black")
                        .attr("id", "axis")

          var cand = [["Rodrigo Red", "140"], ["Belinda Blue", "180"], ["Gracey Grey", "300"], ["Terrence Teal", "340"]]
          svg.selectAll(".candName").data(cand).enter().append("text")
                        .attr("x", 3*width/4 + 10)
                        .attr("y", function(d, i){return d[1]})
                        .text(function(d){return d[0]})
                        .attr("font-family", "akkurat")
                        .attr("font-size", "16px")
                        .attr("fill", "black")
                        .attr("id", function(d, i) {return "cand".concat(i.toString())})
                        .attr("class", "candName")

        })

    }
    if (this.state.data == "10") {
      var red = svg.selectAll("#red.v1");
      var blue = svg.selectAll("#blue.v1");
      var grey = svg.selectAll("#grey.v1");
      var teal = svg.selectAll("#teal.v1");

      svg.selectAll(".v1shadow")
         .transition(function(d, i) {return 50 + i*15})


      red.transition()
        .duration(2000)
        .attr("cx", function(d, i) {return 3*width/4 - 15 - 15*i})
        .attr("cy", 135)
        .attr("r", 6)

      blue.transition()
          .duration(2000)
          .attr("cx", function(d, i) {return 3*width/4 - 15 - 15*i})
          .attr("cy", 175)
          .attr("r", 6)

      grey.transition()
          .duration(2000)
          .attr("cx", function(d, i) {return 3*width/4 - 15 - 15*i})
          .attr("cy", 295)
          .attr("r", 6)

      teal.transition()
          .duration(2000)
          .attr("cx", function(d, i) {return 3*width/4 - 15 - 15*i})
          .attr("cy", 335)
          .attr("r", 6)

      svg.selectAll(".v1shadow")
         .attr("opacity", 1)




      // var max = Math.max(red.size(), blue.size(), grey.size(), teal.size());
      // var bold = "";
      // if (red.size() === max) {
      //   bold = "#cand0";
      // } else if (blue.size() === max) {
      //   bold = "#cand1";
      // } else if (grey.size() === max){
      //   bold = "#cand2";
      // } else {
      //   bold = "#cand3"
      // }
      // this.sleep(2200).then(() => {
      //   svg.select(bold)
      //      .transition(2000)
      //      .attr("font-weight", 900)
      // })
      this.setState({redSize: red.size(), blueSize: blue.size(), greySize: grey.size(), tealSize: teal.size()});
    }

    if (this.state.data === "11") {
      svg.selectAll("#red.v1,#teal.v1").remove()
    }

    if (this.state.data === "12") {
      svg.selectAll(".v2shadow")
         .attr("opacity", 1)
      svg.selectAll("[firstvote=v1red],[firstvote=v1teal]")
         .transition().duration(1000)
         .attr("cx",  4*width/25)
      this.sleep(2250).then(() => {
        var blueSize = this.state.blueSize
        var greySize = this.state.greySize
        svg.selectAll("#grey[firstvote=v1teal]")
           .transition()
           .duration(2000)
           .attr("cx", function(d, i) {return 3*width/4 - 15 - 15*i - 15*greySize})
           .attr("cy", 295)
           .attr("r", 6)

        svg.selectAll("#blue[firstvote=v1red]")
           .transition()
           .duration(2000)
           .attr("cx", function(d, i) {return 3*width/4 - 15 - 15*i - 15*blueSize})
           .attr("cy", 175)
           .attr("r", 6)

      })
    }

    if (this.state.data === "13") {

    }
  }

  sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
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
      if (wait !== 0) {
        this.sleep(speed).then(() => {
          if (index === 2) {
            wait = 0
          }
          this.rcvballotToDot(index+1, width, svg, wait, speed, ballots)
        })

      } else {
        this.rcvballotToDot(index+1, width, svg, wait, speed, ballots)
      }
    }
    this.setState({svg: svg});

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
    svg.selectAll(".candName").remove()
    var cand = [["Rodrigo Red", "140"], ["Belinda Blue", "180"], ["Gracey Grey", "300"], ["Terrence Teal", "340"]]
    svg.selectAll(".candName").data(cand).enter().append("text")
                  .attr("x", 3*width/4 + 10)
                  .attr("y", function(d, i){return d[1]})
                  .text(function(d){return d[0]})
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

    // svg.append("text")
    //               .text("Voting")
    //               .attr("font-family", "akkurat")
    //               .attr("font-size", "16px")
    //               .attr("fill", "black")
    //               .attr("id", "voterlabel2")
    //               .attr("class", "voterlabel")
    //               .attr("transform", "translate(25,300)rotate(-90)")

    var v =  [[3, 0, 1], [0, 1, 0], [3, 0, 1], [1, 0, 0], [2, 0, 0], [2, 0, 0],
              [2, 0, 0], [1, 0, 0], [2, 0, 0], [0, 1, 0], [1, 0, 0], [1, 0, 0],
              [2, 0, 0], [0, 0, 0], [3, 0, 0], [0, 1, 0], [2, 0, 0], [3, 0, 1],
              [1, 0, 0], [2, 0, 0], [1, 0, 0], [0, 0, 0], [2, 0, 0], [3, 0, 0], [1, 0, 0]]
    var colors = ["red", "blue", "grey", "teal"]
    var rgbs = ["#ED4F3A", "#2994D2", "#34495D", "#C9E4E4"]
    svg.selectAll("votes").data(v).enter().append("circle")
       .attr("cx", width/16).attr("cy", function(d,i){return 3*width/32 + i*15 - 15})
       .attr("r", 6).attr("fill", function(d, i){return (rgbs[d[0]])})
       .attr("id", function(d) {return (colors[d[0]])})
       .attr("blue-detractor", function(d) {return (d[1] === 1 ? "true" : "false")})
       .attr("grey-detractor", function(d) {return (d[2] === 1 ? "true" : "false")})



    // ballot to dot transformation
    this.setState({initialized: true, svg: svg});
  }



  render() {
    const { data, value } = this.state;


    return (
      <div css={narrativeStyle}>

      <div className='main'>
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
