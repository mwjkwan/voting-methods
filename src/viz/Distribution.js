/** @jsx jsx */
import React, { Component } from 'react';
import { CardColumns, Button, ButtonGroup } from "react-bootstrap";
import { css, jsx } from '@emotion/core';
import { select, selectAll, mouse } from 'd3-selection';
import { csv } from 'd3-fetch';
import { path } from 'd3-path';
import { axisLeft, axisBottom } from 'd3-axis';
import { transition } from 'd3-transition';
import { nest } from 'd3-collection';
import { scaleOrdinal, scaleBand, scaleLinear } from 'd3-scale';
import topoData from '../assets/data/countries.json';

const d3 = { select, selectAll, mouse, csv, path, scaleOrdinal, transition,
  nest, scaleBand, scaleLinear, axisLeft, axisBottom };

// const d3 = { select, selectAll, mouse, csv, scaleOrdinal, transition, nest };

const landingStyle = css`
  .header {
    padding: 2em;
  }
  }
`;

export default class Distribution extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: "",
      svg: null,
      x: null,
      xAxis: null,
      y: null,
      yAxis: null,
      height: 0,
      initialized: false,
    }
  }

  componentDidMount() {
    this.initialize();
  }

  initialize() {
    // set the dimensions and margins of the graph

    const margin = {top: 30, right: 30, bottom: 70, left: 60},
          width = 460 - margin.left - margin.right,
          height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3.select("#my_dataviz")
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    // Initialize the X axis
    const x = d3.scaleBand()
                .range([ 0, width ])
                .padding(0.2);
    const xAxis = svg.append("g")
                      .attr("transform", "translate(0," + height + ")");
    
    console.log("HELLO X")
    console.log(x);

    // Initialize the Y axis
    const y = d3.scaleLinear()
                .range([ height, 0]);
    const yAxis = svg.append("g")
                     .attr("className", "myYaxis")


    // set state
    this.setState({
      initialized: true,
      svg: svg,
      x: x,
      y: y,
      xAxis: xAxis,
      yAxis: yAxis,
      height: height,
    });

    console.log("initialized")
  }

  update(selectedVar) {
    console.log('updating data');
    // Parse the Data
    d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/barplot_change_data.csv", data => {
      console.log(data)
      const {svg, height, x, y, xAxis, yAxis} = this.state;

      // X axis
      x.domain(['A', 'B', 'C'])
      xAxis.transition().duration(300).call(d3.axisBottom(x))

      // Add Y axis
      // Math.max(data, function(d) { return +d[selectedVar] })
      y.domain([0, 100]);
      yAxis.transition().duration(300).call(d3.axisLeft(y));

      // variable u: map data to existing bars
      var u = svg.selectAll("rect")
        .data(data)

      // update bars
      u
        .enter()
        .append("rect")
        .merge(u)
        .transition()
        .duration(500)
          .attr("x", function(d) { return x(d.group); })
          .attr("y", function(d) { return y(d[selectedVar]); })
          .attr("width", x.bandwidth())
          .attr("height", function(d) { return height - y(d[selectedVar]); })
          .attr("fill", "#69b3a2")
    });
  }

  render() {
    return (
      <div>
        <Button onClick={() => this.update('var1')}>Variable 1</Button>{' '}
        <Button onClick={() => this.update('var2')}>Variable 2</Button>
        <div id="my_dataviz"></div>
      </div>
    )
  }
}
