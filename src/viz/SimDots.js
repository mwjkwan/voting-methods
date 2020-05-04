/** @jsx jsx */
import React, { Component } from 'react';
import { css, jsx } from '@emotion/core';
import { Form } from "react-bootstrap";

import { select, selectAll, mouse, event } from 'd3-selection';
import { csv } from 'd3-fetch';
import { extent, max, descending } from 'd3-array';
import { scaleOrdinal, scaleLinear, scaleBand } from 'd3-scale';
import { transition } from 'd3-transition';
import { nest } from 'd3-collection';
import { axisLeft, axisBottom } from 'd3-axis';
import { legendColor } from 'd3-svg-legend';

const d3 = { select, selectAll, mouse, event, csv, max, descending, scaleOrdinal, scaleLinear, scaleBand, transition, nest, axisLeft, axisBottom, legendColor };

export default class SimDots extends Component {
  constructor(props) {
    super(props);

    this.state = {
      electionData: [],
      nestedData: [],
      groups: [],
      x: null,
      color: null,
      svg: null,
      width: 0,
      height: 0,

    }

  }

  componentDidMount() {
    Promise.all([
      d3.csv(`${process.env.PUBLIC_URL}/data/election_data.csv`),
    ]).then(([res]) => {
        this.setState({ electionData: res });
        this.initialize();
    });
  }

  initialize() {
    var parentWidth = d3
      .select('.simDots-graphic')
      .node()
      .getBoundingClientRect().width;

    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 30, bottom: 80, left: 30},
        width = parentWidth - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#simDots")
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");



    var data = d3.nest()
      .key((d) => d.place).sortKeys(d3.ascending)
      .entries(this.state.electionData);

    var groups = data.map((d) => d.key);

    var x = d3.scaleBand()
      .domain(groups)
      .range([0, width])
      .padding(0.2);

    const color = d3
        .scaleOrdinal()
        .domain(groups)
        .range(["#48A36D", "#64B98C", "#80CEAA", "#7FC9BD", "#7EC4CF", "#7FB1CF", "#809ECE", "#8F90CD", "#9E81CC", "#B681BE", "#CE80B0", "#D76D8F", "#E05A6D", "#E26962", "#E37756", "#E39158", "#E2AA59", "#DFB95C", "#DBC75F", "#EAD67C"]);

    svg.append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x))
      .selectAll('text')
        .attr('transform', 'translate(-10, 0)rotate(-45)')
        .style('text-anchor', 'end');

    this.setState({ svg: svg, groups: groups, x: x, width: width, height: height, color: color });

    this.update();

  }

  update() {

    var nestedData = d3.nest()
      .key((d) => d.place).sortKeys(d3.descending)
      .entries(this.state.electionData.filter((d) => d.different === "TRUE"));
    console.log(nestedData);

    var y = d3.scaleLinear()
      .domain([0, d3.max(nestedData, (x) => x.values.length)])
      .range([this.state.height, 0]);

    this.state.svg.append('g')
        .call(d3.axisLeft(y));

    var bars = this.state.svg.selectAll('.bar')
      .data(nestedData)
      .enter()
      .append('g')
      .attr('class', 'bar')
      .attr('transform', (d) => 'translate(' + (this.state.x(d.key) + this.state.x.bandwidth()/2) + ', 0)');

    bars.selectAll('circle')
      .data((d) => d.values.map((x) => ( { key: d.key, value: x } )))
      .enter()
      .append('circle')
        .attr('cy', (d, i) => this.state.height - 20*i - 10)
        .attr('r', 10)
        .attr('fill', (d) => this.state.color(d.key));




  }

  render() {
    return (
      <div className="simDots-graphic">
        <div id="simDots"></div>
      </div>
    )
  }

}
