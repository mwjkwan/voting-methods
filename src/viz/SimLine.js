/** @jsx jsx */
import React, { Component } from 'react';
import { css, jsx } from '@emotion/core';
import { select, selectAll, mouse, event } from 'd3-selection';
import { csv } from 'd3-fetch';
import { path } from 'd3-path';
import { extent, max, bisector } from 'd3-array';
import { scaleOrdinal, scaleLinear, scaleTime } from 'd3-scale';
import { line } from 'd3-shape';
import { transition } from 'd3-transition';
import { nest } from 'd3-collection';
import { queue } from 'd3-queue';
import { timeParse } from 'd3-time-format';
import { axisLeft, axisBottom } from 'd3-axis';
import d3Tip from 'd3-tip';

const d3 = { select, selectAll, mouse, event, csv, path, line, extent, max, bisector, scaleOrdinal, scaleLinear, scaleTime, timeParse, transition, nest, queue, axisLeft, axisBottom };

export default class SimLine extends Component {
  constructor(props) {
    super(props);
    this.state = {
      electionData: [],
      groupedData: [],
    }
  }
  componentDidMount() {
    Promise.all([
      d3.csv(`${process.env.PUBLIC_URL}/data/election_data.csv`),
    ]).then(([res]) => {
        const tempData = res.map((d) => {
          return { ...d,
            date: +d.date,
            num_winners: +d.num_winners,
            fptp_votes: +d.fptp_votes }
        })
        this.setState({ electionData: tempData });
        this.initialize();
    });
  }

  initialize() {
    var parentWidth = d3
      .select('.simLine-graphic')
      .node()
      .getBoundingClientRect().width;

    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 100, bottom: 30, left: 30},
        width = parentWidth - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#simLine")
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    const groups = ["total", "difference"];

    var elections = d3.nest()
      .key((d) => d.date)
      .entries(this.state.electionData);

    elections = elections.filter((d) => d.key !== "NaN");

    const groupedData = groups.map((grp) => {
      return {
        name: grp,
        values: elections.map((d) => {
          return {
            year: d3.timeParse("%Y")(d.key),
            value: grp === "total" ? d.values.length : d.values.filter((v) => v.different === "TRUE").length,
          }
        }).sort((a, b) => a.year - b.year )
      }})

      console.log(groupedData)

      const color = d3.scaleOrdinal()
        .domain(groups)
        .range(['#9E81CC', '#48A36D']);

      const x = d3.scaleTime()
        .domain(d3.extent(groupedData[0]['values'], (d) => d.year))
        .range([0, width]);

      svg.append("g")
        .attr("transform", "translate(0, " + (height + margin.top) + ")")
        .call(d3.axisBottom(x));

      const y = d3.scaleLinear()
        .domain([0, d3.max(groupedData[0]['values'], (d) => d.value)])
        .range([height, 0]);

      svg.append("g")
        .call(d3.axisLeft(y));

      var line = d3.line()
        .x((d) => x(+d.year))
        .y((d) => y(+d.value));

      svg.selectAll('.lines')
        .data(groupedData)
        .enter()
        .append('path')
          .attr('class', 'lines')
          .attr('d', (d) => line(d.values))
          .attr('stroke', (d) => color(d.name))
          .style('stroke-width', 4)
          .style('fill', 'none');

      svg.selectAll('.dots')
        .data(groupedData)
        .enter()
          .append('g')
          .attr('class', 'dots')
          .style('fill', (d) => color(d.name))
        .selectAll('.dot')
        .data((d) => d.values)
        .enter()
        .append('circle')
          .attr('class', 'dot')
          .attr('cx', (d) => x(d.year))
          .attr('cy', (d) => y(d.value))
          .attr('r', 5)
          .attr('stroke', 'white');

      svg.selectAll('.labels')
        .data(groupedData)
        .enter()
        .append('g')
        .append('text')
          .attr('class', 'labels')
          .datum((d) => { return { name: d.name, value: d.values[d.values.length - 1]}; })
          .attr('transform', (d) => 'translate(' + x(d.value.year) + ',' + y(d.value.value) + ')')
          .attr('x', 10)
          .text((d) => d.name)
          .style('fill', (d) => color(d.name))
          .style('font-size', '14');

        var focus1 = svg.append("g")
            .attr("class", "focus")
            .style("display", "none");

        focus1.append("line")
            .attr("class", "x-hover-line1 hover-line")
            .attr("y1", 0)
            .attr("y2", height);

        focus1.append("line")
            .attr("class", "y-hover-line1 hover-line")
            .attr("x1", width)
            .attr("x2", width);

        focus1.append("circle")
            .attr("r", 7.5)
            .attr('fill', '#9E81CC');

        focus1.append("text")
            .attr("x", 15)
          	.attr("dy", ".31em");

        var focus2 = svg.append("g")
            .attr("class", "focus")
            .style("display", "none");

        focus2.append("line")
            .attr("class", "x-hover-line2 hover-line")
            .attr("y1", 0)
            .attr("y2", height);

        focus2.append("line")
            .attr("class", "y-hover-line2 hover-line")
            .attr("x1", width)
            .attr("x2", width);

        focus2.append("circle")
            .attr("r", 7.5)
            .attr('fill', '#48A36D');

        focus2.append("text")
            .attr("x", 15)
          	.attr("dy", ".31em");


        svg.append("rect")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .attr("class", "overlay")
            .attr("width", width)
            .attr("height", height)
            .style('fill', 'none')
            .style('pointer-events', 'all')
            .on("mouseover", function() { focus1.style("display", null); focus2.style("display", null); })
            .on("mouseout", function() { focus1.style("display", "none"); focus2.style("display", 'none');})
            .on("mousemove", mousemove);

        var bisectDate = d3.bisector(function(d) { return d.year; }).left;

        function mousemove() {
          var x0 = x.invert(d3.mouse(this)[0]),
              i = bisectDate(groupedData[0].values, x0, 1),
              d0 = groupedData[0].values[i - 1],
              d1 = groupedData[0].values[i];
          if (d0 && d1) {
              var j = x0 - d0.year > d1.year - x0 ? i : i-1;
            } else {
              var j = i-1;
            }
          var a = groupedData[0].values[j];
          var b = groupedData[1].values[j];
          focus1.attr("transform", "translate(" + x(a.year) + "," + y(a.value) + ")");
          focus1.select("text").text(function() { return a.value; });
          focus1.select(".x-hover-line1").attr("y2", height - y(a.value));
          focus1.select(".y-hover-line1").attr("x2", width + width);

          focus2.attr("transform", "translate(" + x(b.year) + "," + y(b.value) + ")");
          focus2.select("text").text(function() { return b.value; });
          focus2.select(".x-hover-line2").attr("y2", height - y(b.value));
          focus2.select(".y-hover-line2").attr("x2", width + width);
        }

  }

  render() {
    return (
      <div className="simLine-graphic">
        <div id="simLine"></div>
      </div>
    )
  }


}
