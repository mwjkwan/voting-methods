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

export default class SimBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      electionData: [],
      distinctData: [],
      width: 0,
      height: 0,
      svg: null,
      y: null,
      ySubgroup: null,
      color: null,
      RCVx: null,
      FPTPx: null,
      selected: "all",
    }
    this.handleSelect = this.handleSelect.bind(this);
    this.initialize = this.initialize.bind(this);
    this.update = this.update.bind(this);
  }

  componentDidMount() {
    Promise.all([
      d3.csv(`${process.env.PUBLIC_URL}/data/election_data.csv`),
    ]).then(([res]) => {
        const distinctData = res.filter((v, i, a) => a.map(x => x.candidates.toLowerCase()).indexOf(v.candidates.toLowerCase()) === i);
        this.setState({ electionData: res, distinctData: distinctData });
        this.initialize();
    });
  }

  handleSelect(e) {
    e.preventDefault();
    this.setState({ selected: e.target.value });
    this.update(e.target.value);
  }

  initialize() {
    const viz = this;

    var parentWidth = d3
      .select('.simBar-graphic')
      .node()
      .getBoundingClientRect().width;

    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 50, bottom: 30, left: 50},
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


    const groups = RCV.map((d) => d.key);
    const subgroups = ["M", "F"];

    var RCVx = d3.scaleLinear()
      .domain([0, d3.max(RCV, (d) => d3.max(d.values, (v) => v.values.length ))])
      .range([0, width/2 - 30]);

    var FPTPx = d3.scaleLinear()
      .domain([0, d3.max(RCV, (d) => d3.max(d.values, (v) => v.values.length ))])
      .range([width/2, 30]);

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
      .attr('class', 'legend')
      .attr('transform', 'translate(20, 20)');

    var legendOrdinal = d3.legendColor()
      .scale(color);

    svg.select('.legend')
      .call(legendOrdinal);

    svg.append('g')
      .attr('class', 'bars');


    viz.setState({ svg: svg, y: y, ySubgroup: ySubgroup, color: color, RCVx: RCVx, FPTPx: FPTPx, width: width, height: height });

    this.update('all');

  }

  update(selected) {
    const viz = this;
    var RCV;
    var FPTP;


    if (selected === "all") {
      RCV = d3.nest()
        .key((d) => d.place).sortKeys(d3.descending)
        .key((d) => d.gender)
        .entries(this.state.electionData.filter((d) => d.rcv === "TRUE" ));

      FPTP = d3.nest()
        .key((d) => d.place).sortKeys(d3.descending)
        .key((d) => d.gender)
        .entries(this.state.electionData.filter((d) => d.fptp === "TRUE" ));
    } else if (selected === "distinct") {
      RCV = d3.nest()
        .key((d) => d.place).sortKeys(d3.descending)
        .key((d) => d.gender)
        .entries(this.state.distinctData.filter((d) => d.rcv === "TRUE" ));

      FPTP = d3.nest()
        .key((d) => d.place).sortKeys(d3.descending)
        .key((d) => d.gender)
        .entries(this.state.distinctData.filter((d) => d.fptp === "TRUE" ));
    }


    var rcvPlaceSelect = viz.state.svg.select('.bars')
      .selectAll('g.rcv-place')
      .data(RCV);

    var rcvPlace = rcvPlaceSelect.enter()
      .append('g')
        .attr('class', 'rcv-place')
        .merge(rcvPlaceSelect)
        .attr('transform', (d) => 'translate(' + (viz.state.width/2) + ', ' + viz.state.y(d.key) + ')');

    rcvPlace.transition();

    rcvPlaceSelect.exit().remove();

    var rcvBarSelect = rcvPlace.selectAll('rect.rcv-bars')
      .data((d) => d.values )

    var rcvBar = rcvBarSelect.enter().append('rect')
        .attr('class', 'rcv-bars')
        .merge(rcvBarSelect)
        .attr('x', 50)
        .attr('y', (d) =>  viz.state.ySubgroup(d.key)  )
        .attr('height', (d) => viz.state.ySubgroup.bandwidth())
        .attr('width', (d) => viz.state.RCVx(d.values.length))
        .attr('fill', (d) => viz.state.color(d.key));

    rcvBar.transition();

    rcvBarSelect.exit().remove();

    var rcvTextSelect = rcvPlace.selectAll('text.rcv-labels')
      .data((d) => d.values )

    rcvTextSelect.enter().append('text')
      .attr('class', 'rcv-labels')
      .merge(rcvTextSelect)
      .attr('x', (d) => viz.state.RCVx(d.values.length) + 60)
      .attr('y', (d) => viz.state.ySubgroup(d.key) + viz.state.ySubgroup.bandwidth()/2 + 6)
      .text((d) => d.values.length);

    rcvTextSelect.exit().remove();

    var fptpPlaceSelect = viz.state.svg.select('.bars')
      .selectAll('g.fptp-place')
      .data(FPTP)

    var fptpPlace = fptpPlaceSelect.enter()
      .append('g')
        .attr('class', 'fptp-place')
        .merge(fptpPlaceSelect)
        .attr('transform', (d) => 'translate(-50, ' + viz.state.y(d.key) + ')');

    fptpPlaceSelect.exit().remove();

    var fptpBarSelect = fptpPlace.selectAll('rect.fptp-bars')
      .data((d) => d.values )

    var fptpBar = fptpBarSelect.enter().append('rect')
        .attr('class', 'fptp-bars')
        .merge(fptpBarSelect)
        .attr('x', (d) =>  viz.state.FPTPx(d.values.length) )
        .attr('y', (d) => viz.state.ySubgroup(d.key)  )
        .attr('height', (d) => viz.state.ySubgroup.bandwidth())
        .attr('width', (d) => (viz.state.width/2) - viz.state.FPTPx(d.values.length))
        .attr('fill', (d) => viz.state.color(d.key));

    fptpBar.transition();

    fptpBarSelect.exit().remove();

    var fptpTextSelect = fptpPlace
        .selectAll('text.fptp-labels')
        .data((d) => d.values )

    fptpTextSelect.enter().append('text')
          .attr('class', 'fptp-labels')
          .merge(fptpTextSelect)
          .attr('x', (d) => viz.state.FPTPx(d.values.length) - 25)
          .attr('y', (d) => viz.state.ySubgroup(d.key) + viz.state.ySubgroup.bandwidth()/2 + 6)
          .text((d) => d.values.length);

    fptpTextSelect.exit().remove();


  }

  render() {
    return (
      <div className="simBar-graphic">
        <Form.Control as="select" onChange={this.handleSelect} >
          <option value="all">All Elections</option>
          <option value="distinct">Distinct Candidates</option>
        </Form.Control>
        <div id="simBar"></div>
      </div>
    )
  }
}
