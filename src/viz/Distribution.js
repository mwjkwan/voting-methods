/** @jsx jsx */
import React, { Component } from 'react';
import { css, jsx } from '@emotion/core';
import { Scrollama, Step } from 'react-scrollama';
import { select, selectAll, mouse } from 'd3-selection';
import { csv } from 'd3-fetch';
import { path } from 'd3-path';
import { scaleOrdinal, scaleLinear, scaleBand } from 'd3-scale';
import { transition } from 'd3-transition';
import { nest } from 'd3-collection';
import { axisBottom, axisTop, axisLeft } from 'd3-axis';
import { line } from 'd3-shape';
import { format } from 'd3-format';
import { range } from 'd3-array';
import { drag } from 'd3-drag';


const d3 = { axisBottom, axisLeft, axisTop, drag, range, format, select, selectAll, line, mouse, csv, path, scaleOrdinal, transition, scaleBand, scaleLinear, nest };

const style = css`
  .distribution {
    min-height: 500px;
    margin; 100px;
  }
  body {
    font: 12px sans-serif;
  }
  .guides {
    stroke-width: 1px;
  }
  .guides line {
    stroke: #BBF;
    shape-rendering: crispEdges;
  }
  .guides circle {
    fill: #BBF;
    stroke: #348;
    opacity: 0.2;
  }

  .rules line, .rules path {
    shape-rendering: crispEdges;
    stroke: #000;
  }

  .rules .tick {
  }
  .rules .minor {
    stroke: #BBB;
  }
  .rules .domain {
    fill: none;
  }

  .grid .tick {
    stroke: #CCC;
  }

  .series path {
    fill: none;
    stroke: #348;
    stroke-width: 3px;
  }
`
;

export default class Distribution extends Component {
  constructor(props) {
    super(props);
    //const stories = ['Motivation', 'FPTP', 'con 1', 'example 1', 'con 2', 'example 2']
    this.state = {
      svg: null,
      initialized: false,
      candidates: {
        "A": {xpos: -3, color: "#ed4f3a"},
        "B": {xpos: 0, color: "#2994d2"},
        "C": {xpos: 5, color: "#34495d"},
      }
      }
    }

  componentDidMount() {
    this.initialize();
  }

  componentDidUpdate() {
    // const id = d3.select(this).attr("id");
    // const xpos = x.invert(d3.select(this).attr("cx"));
    // const color = d3.select(this).attr("color");
    // change the state reflected in data
  }

  update() {
    console.log('updating');
    var svg = this.state.svg;
    var parentWidth = d3
      .select('.distribution')
      .node()
      .getBoundingClientRect().width;
    const margin = { top: 0, right: 0, bottom: 0, left: 50 };
    var width = parentWidth - margin.left - margin.right;
    this.setState({svg: svg, width: parentWidth});
  }

  initialize() {
    Promise.all([
      this.scaffold()
    ]).then(() => {
        this.make_rules();
        this.chart_line();
        this.renderCandidates();
    });
  }

  scaffold() {
    const { candidates } = this.state;
    var parentWidth = d3
      .select('.distribution')
      .node()
      .getBoundingClientRect().width;
    const margin = { top: 0, right: 0, bottom: 0, left: 50 };
  
    var width = parentWidth - margin.left - margin.right;
    var height = 400 - margin.top - margin.bottom;
    var radius = 10;
    var pad = 50;

    var x = d3.scaleLinear().domain([-10, 10]).range([0, width]);
    var y = d3.scaleLinear().domain([ 0, 1.1]).range([height, 0]);
    this.setState({width, height, x, y})

    var svg = d3.select(".distribution")
        .append("svg:svg")
        .attr("height", height + pad)
        .attr("width",  width + pad)

    var vis = svg.append("svg:g")
        .attr("transform", "translate(40,20)")

    var continuous = this.make_gaussian_func(0, 1);

    var guides = vis.append("svg:g")
      .classed("guides", true)
      .attr("stroke-width", "1px");

    // store svg info
    this.setState({initialized: true, guides: guides, svg: svg, vis: vis, continuous: continuous, y_guides: null});
  }

  renderCandidates () {
    const { vis, candidates, continuous, x, y } = this.state;
    const points = Object.keys(candidates).map(id => {
      vis.append("circle")
            .classed("candidate", true)
            .attr("id", id)
            .attr("r",10)
            .attr("color",candidates[id].color)
            .attr("cx", x(candidates[id].xpos))
            .attr("cy", y(continuous(candidates[id].xpos)))
            .attr("fill", candidates[id].color)
            .attr("stroke", "#348")
            .attr("opacity", "0.8")
    })

    let drag = d3.drag()
                .on('start', dragstarted)
                .on('drag', dragged)
                .on('end', dragended);
    
    function dragstarted() {
      d3.select(this).raise().classed('active', true);
    }
      
    function dragged() {
      const xi = x.invert(d3.mouse(this)[0]);
      if (xi <= 10.0 && xi >= -10.0) {
        d3.select(this)
          .attr('cx', x(xi))
          .attr('cy', y(continuous(xi)));
      }
    }
      
    function dragended() {
      d3.select(this).classed('active', false);
      console.log(d3.select(this).attr("id"));
      const id = d3.select(this).attr("id");
      const xpos = x.invert(d3.select(this).attr("cx"));
      const color = d3.select(this).attr("color");
    }

    d3.selectAll("circle")
      .call(drag);
  }

  make_gaussian_func (mu, sigma_squared) {
    // per: http://en.wikipedia.org/wiki/Gaussian_function
    // and: http://mathworld.wolfram.com/GaussianFunction.html
    var sqrt = Math.sqrt, powidth = Math.pow, e = Math.E, pi = Math.PI;
    var sigma = sqrt(sigma_squared);
    var a = 1 / (sigma * sqrt(2 * pi));
    return (function(xi) {
        return Math.pow( a * e, - Math.pow(xi - mu, 2) / (2 * Math.pow(sigma, 2)) )
      });
  }

  make_uniform_func () {
    return (function(_xi) {
      return 0.5
    })
  }

  chart_line() {
    const { vis, x, y, continuous } = this.state;
    var g = vis.append("svg:g")
        .classed("series", true)
  
    g.append("svg:path")
        .attr("d", function(d) { return d3.line()(
          x.ticks(100).map(function(xi) {
            return [ x(xi), y(continuous(xi)) ]
          })
         )})
        .attr("fill", "none")
        .attr("stroke", "#348")
        .attr("stroke-width", "3px")
  }

  make_rules() {
    const { vis, width, height, x, y, continuous, legend } = this.state;
    var rules = vis.append("svg:g").classed("rules", true)
  
    function make_x_axis() {
      return d3.axisBottom(x)
          .ticks(10)
    }
  
    function make_y_axis() {
      return d3.axisLeft(y)
          .ticks(10)
    }
  
    rules.append("svg:g").classed("grid x_grid", true)
        .attr("transform", "translate(0,"+height+")")
        .call(make_x_axis()
          .tickSize(-height,0,0)
          .tickFormat("")
        )
  
    // rules.append("svg:g").classed("grid y_grid", true)
    //     .call(make_y_axis()
    //       .tickSize(-width,0,0)
    //       .tickFormat("")
    //     )
  
    rules.append("svg:g").classed("labels x_labels", true)
        .attr("transform", "translate(0,"+height+")")
        .call(make_x_axis()
          .tickSize(5)
          // .tickFormat(d3.time.format("%Y/%m"))
        )
  }

  render() {
    return (
      <div css={style}>
        <div className='main'>
          <div className='distribution'>
          </div>
          <div className='barchart'>
          </div>
        </div>
      </div>
      )
  }
}
