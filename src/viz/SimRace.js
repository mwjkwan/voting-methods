/** @jsx jsx */
import React, { Component } from 'react';
import { css, jsx } from '@emotion/core';
import { Form } from "react-bootstrap";
import { Container, Row, Col } from "react-bootstrap";


import { select, selectAll, mouse, event } from 'd3-selection';
import { csv } from 'd3-fetch';
import { extent, max, descending } from 'd3-array';
import { scaleOrdinal, scaleLinear, scaleBand } from 'd3-scale';
import { transition } from 'd3-transition';
import { nest, map } from 'd3-collection';
import { axisLeft, axisBottom } from 'd3-axis';
import { legendColor } from 'd3-svg-legend';
import d3Tip from 'd3-tip';


const d3 = { select, selectAll, mouse, event, csv, max, descending, scaleOrdinal, scaleLinear, scaleBand, transition, nest, map, axisLeft, axisBottom, legendColor };

const race_categories = ['African American', 'Asian', 'Latino', 'Middle Eastern', 'Native American'];

const style = css`
  .toggleContainer {
    display: flex;
    justify-content: space-evenly;
  }
  .selectedToggle {
    font-weight: 600;
  }
  .toggle {
    cursor: pointer;
    font-size: 1.6em;
  }

`;

export default class SimRace extends Component {
  constructor(props) {
    super(props);

    this.state = {
      berkeley_data: [],
      oakland_data: [],
      sf_data: [],
      sl_data: [],
      selected: 'berkeley',
      svg: null,
    }

    this.toggleSelected = this.toggleSelected.bind(this);

  }

  componentDidMount() {
    Promise.all([
      d3.csv(`${process.env.PUBLIC_URL}/data/berkeley_race.csv`),
      d3.csv(`${process.env.PUBLIC_URL}/data/oakland_race.csv`),
      d3.csv(`${process.env.PUBLIC_URL}/data/san_francisco_race.csv`),
      d3.csv(`${process.env.PUBLIC_URL}/data/san_leandro_race.csv`),
    ]).then(([b, o, sf, sl]) => {
        b = b.filter((d) => d.Year !== "");
        o = o.filter((d) => d.Year !== "");
        sf = sf.filter((d) => d.Year !== "");
        sl = sl.filter((d) => d.Year !== "");
        this.setState({ berkeley_data: b, oakland_data: o, sf_data: sf, sl_data: sl });
        this.initialize();
    });
  }

  toggleSelected(e) {
    e.preventDefault();
    var city;
    switch(e.target.id) {
      case 'bToggle':
        city = 'berkeley';
        break;
      case 'oToggle':
        city = 'oakland'
        break;
      case 'sfToggle':
        city = 'san francisco'
        break;
      case 'slToggle':
        city = 'san leandro'
        break;
      default:
        break;
    }
    this.setState({ selected: city })
    this.update(city);
  }

  initialize() {
    const viz = this;

    var parentWidth = d3
      .select('.simRace-graphic')
      .node()
      .getBoundingClientRect().width;

    // set the dimensions and margins of the graph
    var margin = {top: 100, right: 50, bottom: 80, left: 50},
        width = parentWidth - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#simRace")
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

      // color palette = one color per subgroup
    var color = d3.scaleOrdinal()
      .domain(race_categories)
      .range(["#48A36D",  "#7FC9BD", "#809ECE","#B681BE", "#E05A6D"]);

      svg.append('g')
        .attr('class', 'legend')
        .attr('transform', 'translate(' + (width - 100) + ', 20)');

      var legendOrdinal = d3.legendColor()
        .scale(color);

      svg.select('.legend')
        .call(legendOrdinal);


    this.setState({ svg: svg, width: width, height: height, color: color })
    this.update('berkeley');
  }

  update(city) {
    var data;
    switch (city) {
      case 'berkeley':
        data = this.state.berkeley_data;
        break;
      case 'oakland':
        data = this.state.oakland_data;
        break;
      case 'san francisco':
        data = this.state.sf_data;
        break;
      case 'san leandro':
        data = this.state.sl_data;
        break;
      default:
        break;
    }

    var filteredData = data.filter((d) => d['Race/ethnicity identified'] !== 'n/a' && d['Race/ethnicity identified'] !== 'Undetermined');

    filteredData = d3.nest()
      .key((d) => d['Election type (RCV, Primary, General, Runoff)'] === 'RCV' ? 'RCV' : 'FPTP')
      .key((d) => d['Race/ethnicity identified'])
      .rollup((d) => d.length)
      .entries(filteredData)

    var numData = d3.nest()
      .key((d) => d['Election type (RCV, Primary, General, Runoff)'] === 'RCV' ? 'RCV' : 'FPTP')
      .rollup((d) => d.length)
      .entries(data);

    // # candidates by type and year
    var yearData = d3.nest()
      .key((d) => d['Election type (RCV, Primary, General, Runoff)'] === 'RCV' ? 'RCV' : 'FPTP')
      .key((d) => d.Year).sortKeys((a, b) => +a - +b)
      .rollup((d) => d.length)
      .entries(data);

    yearData = d3.map(yearData, (d) => d.key)
    numData = d3.map(numData, (d) => d.key)

      console.log(numData);


    d3.selectAll('.axis').remove();

    const groups = filteredData.map((d) => d.key);

    const x = d3.scaleBand()
      .domain(groups)
      .range([0, this.state.width])
      .padding(0.2);

    const xAxis = d3.axisBottom(x)
      .tickFormat((d) => {
        console.log(d);
        return d + ' (' + yearData.get(d).values[0].key + ' - ' + yearData.get(d).values[yearData.get(d).values.length - 1].key + ', ' + numData.get(d).value + ' candidates)';
      });

    this.state.svg.append('g')
      .attr('class', 'axis')
      .attr('transform', 'translate(0, ' + (this.state.height) + ')')
      .call(xAxis);

    const xSubgroup = d3.scaleBand()
      .domain(race_categories)
      .range([0, x.bandwidth()])
      .padding(0.05);

    // this.state.svg.append('g')
    //   .attr('transform', 'translate(0, ' + (this.state.height - 20) + ')')
    //   .call(d3.axisBottom(xSubgroup));

    const y = d3.scaleLinear()
      .domain([0, d3.max(filteredData, (d) => d3.max(d.values, (x) => x.value))])
      .range([this.state.height, 0]);

    this.state.svg.append('g')
      .attr('class', 'axis')
      .call(d3.axisLeft(y));


    d3.selectAll('g.group').remove();

    var groupSelect = this.state.svg.append("g")
    .selectAll("g.group")
    // Enter in data = loop group per group
    .data(filteredData)

    var tooltip = d3Tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
        return '<b>' + d.key + "</b>: " + d.value + ' candidates';

      })
      .style('color', '#fff')
      .style('background', 'rgba(0, 0, 0, 0.6)')
      .style('padding', '4px 8px')
      .style('border-radius', '4px');

    var barSelect = groupSelect.enter()
    .append("g")
    .attr('class', 'group')
    .merge(groupSelect)
      .attr("transform", (d) => { return "translate(" + x(d.key) + ",0)"; })
      .selectAll("rect.bar")
      .data((d) => {
        return race_categories.map((key) => {
          if (d3.map(d.values, (d) => d.key).get(key)) {
            var val = d3.map(d.values, (d) => d.key).get(key).value
          } else {
            var val = 0;
          }
          return {key: key, value: val };
        });
      })

    barSelect.exit().remove();

    this.state.svg.call(tooltip);

    barSelect.enter().append("rect")
      .attr('class', 'bar')
      .merge(barSelect)
      .attr("x", (d) => {  return xSubgroup(d.key); })
      .attr("y", (d) => { return y(d.value); })
      .attr("width", xSubgroup.bandwidth())
      .attr("height", (d) => { return this.state.height - y(d.value); })
      .attr("fill", (d) => { return this.state.color(d.key); })
      .on('mouseover', function(d) {
        tooltip.show(d, this);

      })
      .on('mouseout', function(d) {
        tooltip.hide(d, this);
      });


  }

  render() {
    return (
      <div css={style}>
        <div className='toggleContainer'>
          <div onClick={this.toggleSelected} id="bToggle" className={ 'toggle ' + (this.state.selected === "berkeley" ? "selectedToggle" : '')}>
            Berkeley
          </div>
          <div onClick={this.toggleSelected} id="oToggle" className={ 'toggle ' + (this.state.selected === "oakland" ? "selectedToggle" : '')}>
            Oakland
          </div>
          <div onClick={this.toggleSelected} id="sfToggle" className={ 'toggle ' + (this.state.selected === "san francisco" ? "selectedToggle" : '')}>
            San Francisco
          </div>
          <div onClick={this.toggleSelected} id="slToggle" className={ 'toggle ' + (this.state.selected === "san leandro" ? "selectedToggle" : '')}>
            San Leandro
          </div>
        </div>
        <div className="simRace-graphic">
          <div id="simRace"></div>
        </div>
      </div>
    )
  }
}
