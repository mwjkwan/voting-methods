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
import { range } from 'd3-array';
import { drag } from 'd3-drag';


const d3 = { axisBottom, axisLeft, drag, range, format, select, selectAll, line, mouse, csv, path, scaleOrdinal, transition, scaleLinear, nest };

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
      svg: null,
      initialized: false,
      candidates: {
        "A": 0,
        "B": 1,
        "C": -1,
      }
    }
  }

  componentDidMount() {
    Promise.all([
      this.initialize()
    ]).then(() => {
        this.make_rules();
        this.chart_line();
        this.renderCandidates();
        // this.make_mouseover_guides();
    });
  }

  update() {
    console.log('updating');
    var svg = this.state.svg;
    var width = this.state.width
    this.setState({svg: svg});
  }

  x (input) {
    const { width } = this.state;
    d3.scaleLinear().domain([-10, 10]).range([0, width]);
  }

  y (input) {
    const { height } = this.state;
    d3.scaleLinear().domain([ 0, 1.1]).range([height, 0]);
  }

  initialize() {
    const { candidates } = this.state;
    var parentWidth = d3
      .select('.graphic')
      .node()
      .getBoundingClientRect().width;
    const margin = { top: 0, right: 0, bottom: 0, left: 50 };
  
    var width = parentWidth - margin.left - margin.right;
    var height = 800 - margin.top - margin.bottom;
    var radius = 10;
    var pad = 50;

    var x = d3.scaleLinear().domain([-10, 10]).range([0, width]);
    var y = d3.scaleLinear().domain([ 0, 1.1]).range([height, 0]);
    this.setState({width, height, x, y})

    var svg = d3.select("body")
        .append("svg:svg")
        .attr("height", height + pad)
        .attr("width",  width + pad)

    var vis = svg.append("svg:g")
        .attr("transform", "translate(40,20)")

    var legend = d3.select("body").append("div")
        .classed("legend", true)

    var continuous = this.make_gaussian_func(0, 1);

    var guides = vis.append("svg:g")
      .classed("guides", true)
      .attr("stroke-width", "1px");

    // // Random circles
    // const circles = d3.range(3).map(i => ({
    //   x: Math.random() * (width - radius * 2) + radius,
    //   y: Math.random() * (width - radius * 2) + radius,
    // }));
  
    // // Help
    // svg.selectAll("circle")
    //   .data(circles)
    //   .enter().append("circle")
    //     .attr("cx", d => d.x)
    //     .attr("cy", d => d.y)
    //     .attr("r", radius)
    //     .call(this.drag);

    // store svg info
    this.setState({initialized: true, guides: guides, svg: svg, vis: vis, legend: legend, continuous: continuous, y_guides: null});

    // initialize axes

  }

  renderCandidates () {
    const { vis, candidates, continuous, x, y } = this.state;
    const points = Object.keys(candidates).map(name => {
      vis.append("circle")
            .classed("candidate", true)
            .attr("r",10)
            .attr("cx", x(candidates[name]))
            .attr("cy", y(continuous(candidates[name])))
            .attr("fill", "#BBF")
            .attr("stroke", "#348")
            .attr("opacity", "0.8")
    })

    let drag = d3.drag()
                .on('start', dragstarted)
                .on('drag', dragged)
                .on('end', dragended);
    
    function dragstarted(d) {
      d3.select(this).raise().classed('active', true);
    }
      
    function dragged(d) {
      const xi = x.invert(d3.mouse(this)[0]);
      const yi = y.invert(d3.mouse(this)[1]);
      d3.select(this)
        .attr('cx', x(xi))
        .attr('cy', y(yi))
    }
      
    function dragended(d) {
      d3.select(this).classed('active', false);
    }

    d3.selectAll("circle")
      .call(drag);

    // d3.selectAll("circle").on("mousedown", function() {
    //   console.log("hi");
    //   var circle = d3.select(this)
    //       .classed("active", true);

    //   var w = d3.select(window)
    //             .on("mousemove", mousemove)
    //             .on("mouseup", mouseup);
    
    //   function mousemove() {
    //     console.log("mouse moved");
    //     var xi = x.invert(d3.mouse(this)[0]);
    //     var format_5f = d3.format(".5f");

    //     circle.attr("transform", "translate("+(x(xi))+",0)")
    //           .attr("transform", "translate(0," + y(continuous(xi))+")")
    //           .attr("visibility", "visible")
    //   }
    
    //   function mouseup() {
    //     circle.classed("active", false);
    //   }
    // });
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
    const { vis, width, height, x, y, continuous, legend, guides, y_guides } = this.state;

    vis.append("svg:rect")
        .classed("mouse_area", true)
        .attr("width",  width)
        .attr("height", height)
        .attr("opacity", "0")
        .on("mousedown", update_legend_values)
  
    blank_legend_values();
  
    var format_5f = d3.format(".5f");
  
    function update_legend_values() {
      var xi = x.invert(d3.mouse(this)[0]);
  
      legend
          .text("x: "+format_5f(xi)+ " | y: "+format_5f(continuous(xi)));
  
      guides
          .attr("transform", "translate("+(x(xi))+",0)")
          .attr("visibility", "visible")
  
      // y_guides
      //     .attr("transform", "translate(0,"+y(continuous(xi))+")")
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
    return (
      <div css={style}>
        <div className='main'>
          <div className='graphic'>
            <div id="viz"></div>
          </div>
        </div>
      </div>
      )
  }
}
