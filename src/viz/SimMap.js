/** @jsx jsx */
import React, { Component } from 'react';
import { css, jsx } from '@emotion/core';
import { select, selectAll, mouse, event } from 'd3-selection';
import { csv } from 'd3-fetch';
import { path } from 'd3-path';
import { extent } from 'd3-array';
import { scaleOrdinal, scaleLinear } from 'd3-scale';
import { transition } from 'd3-transition';
import { nest } from 'd3-collection';
import { queue } from 'd3-queue';
import { geoPath, geoAlbersUsa } from 'd3-geo';
import d3Tip from 'd3-tip';
import * as topojson from 'topojson-client';

import topoData from '../assets/data/usa.json';

const d3 = { select, selectAll, mouse, csv, path, scaleOrdinal, scaleLinear, transition, nest, queue, geoAlbersUsa, geoPath, extent };


export default class SimMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      electionData: [],
      locationData: [],
      topoData: topoData
    }
  }

  componentDidMount() {
    Promise.all([
      d3.csv(`${process.env.PUBLIC_URL}/data/election_data.csv`),
      d3.csv(`${process.env.PUBLIC_URL}/data/election_location.csv`)
    ]).then(([res1, res2]) => {
        this.setState({ electionData: res1, locationData: res2 });
        this.initialize();
    });
  }

  initialize() {

    var parentWidth = d3
      .select('.simMap-graphic')
      .node()
      .getBoundingClientRect().width;


    const margin = { top: 20, right: 40, bottom: 40, left: 40 };

    const width = parentWidth - margin.left - margin.right;
    const height = 720 - margin.top - margin.bottom;

    var svg = d3
        .select('#simMap')
        .append('svg')
        .attr('width', width)
        .attr('height', height);




    var coords = d3.nest()
      .key((d) => d.Place)
      .map(this.state.locationData);
    console.log(coords);
    var elections = d3.nest()
      .key((d) => d.place)
      .key((d) => d.contest)
      .entries(this.state.electionData);

    console.log(elections);

    var bubbleScale = d3.scaleLinear()
      .domain(d3.extent(elections, (d) => d['values'].length ))
      .range([0, 50]);

    const colorScale = d3
        .scaleOrdinal()
        .domain(elections.map((d) => d.key))
        .range(["#48A36D", "#64B98C", "#80CEAA", "#7FC9BD", "#7EC4CF", "#7FB1CF", "#809ECE", "#8F90CD", "#9E81CC", "#B681BE", "#CE80B0", "#D76D8F", "#E05A6D", "#E26962", "#E37756", "#E39158", "#E2AA59", "#DFB95C", "#DBC75F", "#EAD67C"]);

    var projection = d3
        .geoAlbersUsa()
        .scale(1000)
        .translate([svg.attr('width') / 2, svg.attr('height') / 2]);

    const path = d3.geoPath().projection(projection);

    const na = topojson.feature(this.state.topoData, this.state.topoData.objects.states).features;

    svg
      .append('g')
      .attr('class', 'map-base')
      .selectAll('path')
      .data(na)
      .enter()
      .append('path')
      .attr('d', path)
      .attr('fill', '#eeedf0')
      .attr('stroke', '#dcdfe3')
      .attr('stroke-width', 2)
      .style('opacity', function(d) {
        if (
          d.properties.name === 'Alaska' ||
          d.properties.name === 'Hawaii'
        ) {
          return 0;
        } else {
          return 1;
        }
      });

    var bubbles = svg.append('g')
      .attr('class', 'bubbles')
      .selectAll('circle')
      .data(elections);

    bubbles.enter()
      .append('circle')
      .attr('class', 'place-bubble')
      .attr('cx', (d) =>
        projection([coords.get(d.key)[0]['Longitude'], coords.get(d.key)[0]['Latitude']])[0]
        )
      .attr('cy', (d) =>
        projection([coords.get(d.key)[0]['Longitude'], coords.get(d.key)[0]['Latitude']])[1]
      )
      .attr('r', (d) =>  bubbleScale(d['values'].length) )
      .attr('fill', (d) => colorScale(d.key))
      .attr('fill-opacity', '0.6')
      .attr('stroke', (d) => colorScale(d.key))
      .attr('stroke-width', 2);

    bubbles.enter()
      .append('text')
      .attr('class', 'place-label')
      .attr('x', (d) =>
        projection([coords.get(d.key)[0]['Longitude'], coords.get(d.key)[0]['Latitude']])[0] + 20
      )
      .attr('y', (d) =>
        projection([coords.get(d.key)[0]['Longitude'], coords.get(d.key)[0]['Latitude']])[1] - 20
      )
      .text((d) => d.key);


  }

  render() {
    return (
      <div className="simMap-graphic">
        <div id="simMap"></div>
      </div>
    )
  }
}
