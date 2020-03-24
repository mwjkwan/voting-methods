/** @jsx jsx */
import React, { Component } from 'react';
import { css, jsx } from '@emotion/core';
import { Scrollama, Step } from 'react-scrollama';
import { select, selectAll, mouse } from 'd3-selection';
import { csv } from 'd3-fetch';
import { path } from 'd3-path';
import { scaleOrdinal } from 'd3-scale';
import { transition } from 'd3-transition';
import { nest } from 'd3-collection';
import { geoPath } from 'd3-geo';
import { geoRobinson } from 'd3-geo-projection';
import d3Tip from 'd3-tip';
import * as topojson from 'topojson-client';

import topoData from '../assets/data/countries.json';

const d3 = { select, selectAll, mouse, csv, path, scaleOrdinal, transition, nest,
  geoRobinson, geoPath };

const landingStyle = css`
  .main {
    padding: 2em;
    display: flex;
    justify-content: space-between;
  }

  .graphic {
    flex-basis: 80%;
    position: sticky;
    top: 60px;
    width: 100%;
    align-self: flex-start;
  }

  .scroller {
    flex-basis: 15%;
  }

  .step {
    padding-top: 200px;
    padding-bottom: 200px;
    '&:last-child': {
      margin-bottom: 0;
    }
  }
`;

export default class Landing extends Component {

  state = {
    data: 0,
    steps: [10, 20, 30],
    progress: 0,
  }

  onStepEnter = ({ element, data }) => {
    this.setState( { data });
  }

  onStepProgress = ({ element, progress }) => {
    this.setState({ progress });
  }

  componentDidMount() {
    d3.csv(`${process.env.PUBLIC_URL}/data/voting-methods-country.csv`).then(res => {
      this.initialize(topoData, res);
    });
  }

  initialize(topoData, voteData) {

  var parentWidth = d3
    .select('.graphic')
    .node()
    .getBoundingClientRect().width;


   const margin = { top: 20, right: 40, bottom: 40, left: 40 };

  const width = parentWidth - margin.left - margin.right;
  const height = 800 - margin.top - margin.bottom;

  var svg = d3
      .select('#viz')
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    var systems = d3.nest()
        .key((d) => d["Electoral system for national legislature"])
        .entries(voteData)
        .map((d) => d.key);
    console.log(systems);


    const color = d3
        .scaleOrdinal()
        .domain(systems)
        .range(["#48A36D", "#64B98C", "#80CEAA", "#7FC9BD", "#7EC4CF", "#7FB1CF", "#809ECE", "#8F90CD", "#9E81CC", "#B681BE", "#CE80B0", "#D76D8F", "#E05A6D", "#E26962", "#E37756", "#E39158", "#E2AA59", "#DFB95C", "#DBC75F", "#EAD67C"]);

  svg.append('g')
      .attr('class', 'methods')
      .selectAll('text')
      .data(systems)
      .enter()
      .append('text')
      .text((d) => d)
      .style('fill', (d) => color(d))
      .attr('transform', (d, i) => 'translate(1000,' + (100+ 40*i) + ')')
      .on('mouseover', function(d) {
          svg.select('.methods').style('cursor', 'pointer');
        update(svg, d);
      }).on('mouseout', function(d) {
      svg.select('.methods').style('cursor', 'default');
      update(svg, null);
  });

  svg.append('g')
      .attr('class', 'map-base')

  update(svg, null);

  function update(svg, system) {
      // console.log(topoData);
      // console.log(voteData);
      //console.log(system);

     var projection = d3
        .geoRobinson()
        .scale(160)
        .translate([svg.attr('width') / 2 - 100, svg.attr('height') / 2]);

     const path = d3.geoPath().projection(projection);
      var filteredVoteData;
      var entries;
     if (system) {
         filteredVoteData = voteData.filter((d) => d["Electoral system for national legislature"] === system);
         entries = d3.nest()
             .key((d) => d.Country )
             .object(filteredVoteData);
     } else {
         entries = d3.nest()
             .key((d) => d.Country )
             .object(voteData);
     }


     console.log(entries);

    // var countries = entries.map((d) => d.key );
     //console.log(countries);

     const world = topojson.feature(topoData, topoData.objects.countries).features;
    // var topoCountries = world.map((d) => d.properties.name);

    //var unmatchedCountries = countries.filter((c) => !topoCountries.includes(c));
    //console.log(unmatchedCountries);
    var mapBase = svg.select('.map-base');

    var tooltip = mapBase.append("div")
      .attr("class", "tooltip")
      .style('background', '#a4a7ab')
      .style('color', '#fff')
      .style('line-height', 1)
      .style('font-size', '0.8em')
      .style('padding', '8px')
      .style('border-radius', '4px')
      .style('position', 'absolute')
      .style('pointer-events', 'none')
      .style('display', 'hidden');



     var mapSelect = mapBase
        .selectAll('path')
        .data(world);

     mapSelect.exit().remove();

      var map = mapSelect.enter()
        .append('path')
        .merge(mapSelect)
        .attr('d', path);

      map.transition();

      map.attr('fill', function(d) {
            if (entries[convertCountry(d.properties.name)]) {
               return color(entries[convertCountry(d.properties.name)][0]["Electoral system for national legislature"]);
            } else {
              return '#eeedf0';
            }
        })
        .attr('stroke', '#dcdfe3')
        .attr('stroke-width', 1)
        .style('opacity', function(d) {
          return 1;
        })
        .on('mousemove', function(d) {
          var mouse = d3.mouse(svg.node()).map( (d) => parseInt(d) );

          // CANNOT FIND THIS RIP
          tooltip.style('display', 'block')
            .attr('style', 'left:' + (mouse[0]) + 'px;top:' + mouse[1] +'px')
            .html('<b>' + d.properties.name + ':</b> ' + entries[convertCountry(d.properties.name)][0]["Electoral system for national legislature"]);
        })
        .on('mouseout', function(d) {
          tooltip.style('display', 'hidden');
        });

  }

  function convertCountry(country){
  // LOL
    const conversions = {
      "Antigua and Barb.": "Antigua and Barbuda",
      "Bosnia and Herz.":  "Bosnia and Herzegovina",
      "Brunei": "Brunei Darussalam",
      "Cabo Verde": "Cape Verde",
      "Cayman Is.": "Cayman Islands",
      "Central African Rep.": "Central African Republic",
      "Dem. Rep. Congo": "Congo, Democratic Republic of",
      "Cook Is.": "Cook Islands",
      "Côte d'Ivoire": "Cote d'Ivoire",
      "N. Cyprus": "Cyprus (North)",
      "Czechia": "Czech Republic",
      "Dominican Rep.": "Dominican Republic",
      "Eq. Guinea": "Equatorial Guinea",
      "Falkland Is.": "Falkland Islands (Malvinas)",
      "Vatican": "Holy See (Vatican City State)",
      "Iran": "Iran, Islamic Republic of",
      "Laos": "Lao People's Dem. Republic",
      "Marshall Is.": "Marshall Islands",
      "Micronesia": "Micronesia, Federated States of",
      "Moldova": "Moldova, Republic of",
      "Congo": "Republic of The Congo (Brazzaville)",
      "Russia":  "Russian Federation",
      "North Korea": "Korea, Dem. People's Republic of",
      "South Korea": "Korea, Republic of",
      "St. Kitts and Nevis": "Saint Kitts and Nevis",
      "St. Vin. and Gren.": "Saint Vincent and The Grenadines",
      "Solomon Is.": "Solomon Islands",
      "eSwatini": "Swaziland",
      "S. Sudan": "South Sudan",
      "Palestine": "State of Palestine",
      "Syria": "Syrian Arab Republic",
      "Tanzania": "Tanzania, United Republic of",
      "Turks and Caicos Is.": "Turks and Caicos Islands",
      "United States of America": "United States",
      "Vietnam": "Viet Nam",
      "British Virgin Is.": "Virgin Islands, British"

  }
    if (Object.keys(conversions).includes(country)) {
        return conversions[country];
    } else {
        return country;
    }
}

}





  render() {
    const { data, steps, progress } = this.state;


    return (
      <div css={landingStyle}>
      <div className='main'>
        <div className='graphic'>
          <div id="viz"></div>
        </div>
        <div className='scroller'>
          <Scrollama
            onStepEnter={this.onStepEnter}
            onStepExit={this.onStepExit}
            progress
            onStepProgress={this.onStepProgress}
            offset={0.33}
            debug
          >
            {steps.map ( value => (
              <Step data={value} key={value}>
                <div className='step'>
                  <p>step value: {value}</p>
                  <p>{value === data && progress}</p>
                </div>
              </Step>
            ))}
          </Scrollama>
         </div>
      </div>
      </div>
      )
  }
}
