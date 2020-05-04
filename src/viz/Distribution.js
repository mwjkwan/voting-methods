/** @jsx jsx */
import React, { Component } from 'react';
import { css, jsx } from '@emotion/core';
import { Scrollama, Step } from 'react-scrollama';
import { select, selectAll, mouse } from 'd3-selection';
import { csv } from 'd3-fetch';
import { path } from 'd3-path';
import { scaleOrdinal, scaleLinear } from 'd3-scale';
import { transition } from 'd3-transition';
import { nest } from 'd3-collection';
import { axisBottom, axisLeft } from 'd3-axis';
import { line } from 'd3-shape';
import { format } from 'd3-format';


const d3 = { axisBottom, axisLeft, format, select, selectAll, line, mouse, csv, path, scaleOrdinal, transition, scaleLinear, nest };

const style = css`
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
      data: "",
      svg: null,
      step: 0,
      width: 0,
      height: 0,
      redSize: 0,
      blueSize: 0,
      greySize: 0,
      progress: 0,
      initialized: false,
    }
  }

  // onStepEnter = ({ element, data }) => {
  //   element.style.backgroundColor = 'lightgoldenrodyellow';
  //   this.setState( { data });
  //   console.log(data)
  //   this.update();
  // }

  // onStepExit= ({ element }) => {
  //   element.style.backgroundColor = '#fff';
  // }

  // onStepProgress = ({ element, progress }) => {
  //   this.setState({ progress });
  // }

  componentDidMount() {
    Promise.all([
      this.initialize()
    ]).then(() => {
        this.make_rules();
        this.chart_line();
        this.make_mouseover_guides();
    });
  }

  update() {
    console.log('updating');
    var svg = this.state.svg;
    var width = this.state.width
    this.setState({svg: svg});
  }

  initialize() {
    // thanks xisabao
    var parentWidth = d3
      .select('.graphic')
      .node()
      .getBoundingClientRect().width;
    const margin = { top: 0, right: 0, bottom: 0, left: 0 };
  
    var width = parentWidth - margin.left - margin.right;
    var height = 800 - margin.top - margin.bottom;
    var x = d3.scaleLinear().domain([-5, 5]).range([0, width]);
    var y = d3.scaleLinear().domain([ 0, 1]).range([height, 0]);
    this.setState({width, height, x, y})

    var pad = 50;
    var svg = d3.select("body")
        .append("svg:svg")
        .attr("height", height + pad)
        .attr("width",  width + pad)

    var vis = svg.append("svg:g")
        .attr("transform", "translate(40,20)")

    var legend = d3.select("body").append("div")
        .classed("legend", true)

    var continuous = this.make_gaussian_func(-2, .7);

    // store svg info
    this.setState({initialized: true, svg: svg, vis: vis, legend: legend, continuous: continuous});

    // initialize axes
    
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

  make_mouseover_guides() {
    const { vis, width, height, x, y, continuous, legend } = this.state;
    var guides = vis.append("svg:g")
            .classed("guides", true)
            .attr("stroke-width", "1px")
    var y_guides = guides.append("svg:g")
    guides.append("svg:line")
            .attr("y1",height)
    y_guides.append("svg:circle")
            .attr("r",7)
            .attr("fill", "#BBF")
            .attr("stroke", "#348")
            .attr("opacity", "0.8")
    y_guides.append("svg:line")
            .attr("x1",-20)
            .attr("x2",+20)
  
    vis.append("svg:rect")
        .classed("mouse_area", true)
        .attr("width",  width)
        .attr("height", height)
        .attr("opacity", "0")
        .on("mousemove", update_legend_values)
        .on("mouseout",   blank_legend_values)
  
    blank_legend_values();
  
    var format_5f = d3.format(".5f");
  
    function update_legend_values() {
      var xi = x.invert(d3.mouse(this)[0]);
  
      legend
          .text("x: "+format_5f(xi)+ " | y: "+format_5f(continuous(xi)));
  
      guides
          .attr("transform", "translate("+(x(xi))+",0)")
          .attr("visibility", "visible")
  
      y_guides
          .attr("transform", "translate(0,"+y(continuous(xi))+")")
    }
  
    function blank_legend_values() {
      legend
          .text("Mouse over the graph...")
  
      guides
          .attr("visibility", "hidden")
    }
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
  
    rules.append("svg:g").classed("grid y_grid", true)
        .call(make_y_axis()
          .tickSize(-width,0,0)
          .tickFormat("")
        )
  
    rules.append("svg:g").classed("labels x_labels", true)
        .attr("transform", "translate(0,"+height+")")
        .call(make_x_axis()
          .tickSize(5)
          // .tickFormat(d3.time.format("%Y/%m"))
        )
  
    rules.append("svg:g").classed("labels y_labels", true)
        .call(make_y_axis()
          .tickSize(10, 5, 0)
        )
  }

  render() {
    const { data, value } = this.state;


    return (
      <div css={style}>
        <h1>HELLO</h1>
        <div className='main'>
          <div className='graphic'>
            <div id="viz"></div>
          </div>
        </div>
      </div>
      )
  }
}
