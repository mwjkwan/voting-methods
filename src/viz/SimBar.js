/** @jsx jsx */
import React, { Component } from 'react';
import { css, jsx } from '@emotion/core';
import { select, selectAll, mouse, event } from 'd3-selection';
import { csv } from 'd3-fetch';
import { extent, max, descending } from 'd3-array';
import { scaleOrdinal, scaleLinear, scaleBand } from 'd3-scale';
import { transition } from 'd3-transition';
import { nest } from 'd3-collection';
import { axisLeft, axisBottom } from 'd3-axis';

const d3 = { select, selectAll, mouse, event, csv, max, descending, scaleOrdinal, scaleLinear, scaleBand, transition, nest, axisLeft, axisBottom };

export default class SimBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      electionData: [],
    }
  }

  componentDidMount() {
    Promise.all([
      d3.csv(`${process.env.PUBLIC_URL}/data/election_data.csv`),
    ]).then(([res]) => {
      console.log(res);
        this.setState({ electionData: res });
        this.initialize();
    });
  }

  initialize() {
    var parentWidth = d3
      .select('.simLine-graphic')
      .node()
      .getBoundingClientRect().width;

    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 30, bottom: 30, left: 100},
        width = parentWidth - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#simBar")
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    // TODO: filter by fptp vs. rcv winners
    var RCV = d3.nest()
      .key((d) => d.place).sortKeys(d3.descending)
      .key((d) => d.gender)
      .entries(this.state.electionData.filter((d) => d.rcv === "TRUE" ));

    var FPTP = d3.nest()
      .key((d) => d.place).sortKeys(d3.descending)
      .key((d) => d.gender)
      .entries(this.state.electionData.filter((d) => d.fptp === "TRUE" ));
    console.log(RCV);
    console.log(FPTP);

    const groups = RCV.map((d) => d.key);
    const subgroups = ["M", "F"];

    var RCVx = d3.scaleLinear()
      .domain([0, d3.max(RCV, (d) => d3.max(d.values, (v) => v.values.length ))])
      .range([0, width/2]);

    var FPTPx = d3.scaleLinear()
      .domain([0, d3.max(RCV, (d) => d3.max(d.values, (v) => v.values.length ))])
      .range([width/2, 0]);

    svg.append('g')
      .attr('transform', 'translate(' + (width/2 + 50) + ',' + height + ')')
      .call(d3.axisBottom(RCVx));

    svg.append('g')
      .attr('transform', 'translate(' + (-50) + ',' + height + ') ')
      .call(d3.axisBottom(FPTPx));

    var y = d3.scaleBand()
      .domain(groups)
      .range([height, 0])
      .padding(0.2);

      svg.append('g')
        .attr('transform', 'translate(' + (width/2 + 30) + ', 0)')
        .call(d3.axisLeft(y));

    var ySubgroup = d3.scaleBand()
      .domain(subgroups)
      .range([0, y.bandwidth()])
      .padding(0.05);

    var color = d3.scaleOrdinal()
      .domain(subgroups)
      .range(['#9E81CC', '#48A36D']);

    svg.append('g')
      .attr('class', 'bars')
      .selectAll('g.place')
      .data(RCV)
      .enter()
      .append('g')
        .attr('class', 'RCV-place')
        .attr('transform', (d) => 'translate(' + (width/2) + ', ' + y(d.key) + ')')
      .selectAll('rect')
      .data((d) => d.values )
      .enter().append('rect')
        .attr('x', 50)
        .attr('y', (d) => {console.log(d); return ySubgroup(d.key) } )
        .attr('height', (d) => ySubgroup.bandwidth())
        .attr('width', (d) => RCVx(d.values.length))
        .attr('fill', (d) => color(d.key));

    svg.select('.bars')
      .selectAll('g.place')
      .data(FPTP)
      .enter()
      .append('g')
        .attr('class', 'FPTP-place')
        .attr('transform', (d) => 'translate(-50, ' + y(d.key) + ')')
      .selectAll('rect')
      .data((d) => d.values )
      .enter().append('rect')
        .attr('x', (d) =>  { console.log(FPTPx(d.values.length)); return FPTPx(d.values.length)} )
        .attr('y', (d) => ySubgroup(d.key)  )
        .attr('height', (d) => ySubgroup.bandwidth())
        .attr('width', (d) => (width/2) -FPTPx(d.values.length))
        .attr('fill', (d) => color(d.key));





  }

  render() {
    return (
      <div className="simBar-graphic">
        <div id="simBar"></div>
      </div>
    )
  }
}
