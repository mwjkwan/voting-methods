/** @jsx jsx */
import React, { Component } from 'react';
import { css, jsx } from '@emotion/core';
import { select, selectAll, mouse, event } from 'd3-selection';
import { csv } from 'd3-fetch';
import { path } from 'd3-path';
import { extent } from 'd3-array';
import { scaleOrdinal, scaleLinear, scaleLog } from 'd3-scale';
import { transition } from 'd3-transition';
import { nest, map } from 'd3-collection';
import { queue } from 'd3-queue';
import { geoPath, geoAlbersUsa } from 'd3-geo';
import d3Tip from 'd3-tip';
import * as topojson from 'topojson-client';

import topoData from '../assets/data/usa.json';

const d3 = { select, selectAll, mouse, csv, path, scaleOrdinal, scaleLinear, scaleLog, transition, nest, map, queue, geoAlbersUsa, geoPath, extent };


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
        res1 = res1.map((d) => {
          return {
            ...d,
            date: +d.date
          }
        });
        this.setState({ electionData: res1, locationData: res2 });
        this.initialize();
    });
  }

  initialize() {

    var parentWidth = d3
      .select('.simMap-graphic')
      .node()
      .getBoundingClientRect().width;


    const margin = { top: 20, right: 40, bottom: 0, left: 40 };

    const width = parentWidth - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    var svg = d3
        .select('#simMap')
        .append('svg')
        .attr('width', width)
        .attr('height', height);




    var coords = d3.nest()
      .key((d) => d.Place)
      .map(this.state.locationData);
    var elections = d3.nest()
      .key((d) => d.place)
      .entries(this.state.electionData);

    var years = d3.nest()
      .key((d) => d.place)
      .key((d) => d.date).sortKeys((a, b) => +a - +b)
      .entries(this.state.electionData);

    elections = elections.sort((a, b) => b.values.length - a.values.length )

    console.log(years);


    var bubbleScale = d3.scaleLog()
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

    var infoPanel = svg.append('g')
      .attr('class', 'info')
      .attr('width', 150)
      .attr('height', 100)
      .attr('transform', 'translate(' + (width - 150) + ', ' + (height - 150) + ')') ;

    var bubbles = svg.append('g')
      .attr('class', 'bubbles')
      .selectAll('circle')
      .data(elections);

    bubbles.enter()
      .append('circle')
      .attr('class', 'place-bubble')
      .attr('id', (d, i) => 'bubble' + i)
      .attr('cx', (d) =>
        projection([coords.get(d.key)[0]['Longitude'], coords.get(d.key)[0]['Latitude']])[0]
        )
      .attr('cy', (d) =>
        projection([coords.get(d.key)[0]['Longitude'], coords.get(d.key)[0]['Latitude']])[1]
      )
      .attr('r', (d) =>  bubbleScale(d['values'].length) )
      .attr('fill', (d) => colorScale(d.key))
      .attr('fill-opacity', (d) => d.values.length > 20 ? '0.2' : '0.6')
      .attr('stroke', (d) => colorScale(d.key))
      .attr('stroke-width', 2)
      .on('mouseenter', function(d, i) {
        //var mouse = d3.mouse(viz.state.svg.node()).map( (d) => parseInt(d) );

        d3.select('#bubble' + i).style('cursor', 'pointer');
        var placeInfo = coords.get(d.key)[0];
        var placeYears = d3.map(years, (d) => d.key).get(d.key).values;
        infoPanel.append('text')
          .text(placeInfo.Place + ', ' + placeInfo.State + ': ');
        infoPanel.append('text')
          .attr('y', 20)
          .text(d.values.length + ' RCV elections');
        infoPanel.append('text')
          .attr('y', 40)
          .text('from ' + placeYears[0].key + ' to ' + placeYears[placeYears.length - 1].key);
      })
      .on('mouseleave', function(d, i) {
        infoPanel.selectAll('text').remove();
        d3.select('#bubble' + i).style('cursor', 'default');
      });

    bubbles.enter()
      .append('text')
      .attr('class', 'place-label')
      .attr('id', (d, i) => 'label' + i)
      .attr('x', (d) =>
        projection([coords.get(d.key)[0]['Longitude'], coords.get(d.key)[0]['Latitude']])[0] + 10
      )
      .attr('y', (d) => {
        var og = projection([coords.get(d.key)[0]['Longitude'], coords.get(d.key)[0]['Latitude']])[1] - 10;
        var add;
        switch (coords.get(d.key)[0]['Place']) {
          case 'San Francisco':
            add = -25;
            break;
          case 'Oakland':
            add = 0;
            break;
          case 'Berkeley':
          case 'Payson':
            add = 25;
            break;
          case 'San Leandro':
            add = 50;
            break;
          default:
            add = 0;
            break;
        }
        return og + add;
        }
      )
      .text((d) => d.key)
      .on('mouseenter', function(d, i) {
        //var mouse = d3.mouse(viz.state.svg.node()).map( (d) => parseInt(d) );

        d3.select('#label' + i).style('cursor', 'pointer');

        var placeInfo = coords.get(d.key)[0];
        var placeYears = d3.map(years, (d) => d.key).get(d.key).values;
        infoPanel.append('text')
          .text(placeInfo.Place + ', ' + placeInfo.State + ': ');
        infoPanel.append('text')
          .attr('y', 20)
          .text(d.values.length + ' RCV elections');
        infoPanel.append('text')
          .attr('y', 40)
          .text('from ' + placeYears[0].key + ' to ' + placeYears[placeYears.length - 1].key)
      })
      .on('mouseleave', function(d, i) {
        infoPanel.selectAll('text').remove();

        d3.select('#label' + i).style('cursor', 'default');
      });
;


  }

  render() {
    return (
      <div className="simMap-graphic">
        <div id="simMap"></div>
      </div>
    )
  }
}
