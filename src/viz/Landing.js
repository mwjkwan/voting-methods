/** @jsx jsx */
import React, { Component } from 'react';
import { css, jsx } from '@emotion/core';
import { Typography, Link } from '@material-ui/core'
import { Scrollama, Step } from 'react-scrollama';
import { select, selectAll, mouse, event } from 'd3-selection';
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

const longNames = {
  'Overall': '',
  'FPTP': 'First Past The Post',
  'BV': 'Block Vote',
  'FPTP PBV': 'Party Block Vote',
  'AV': 'Alternative Vote',
  'TRS': 'Two-Round System',
  'List PR': 'List Proportional Representation',
  'STV': 'Single Transferable Vote',
  'SNTV': 'Single Non-Transferable Vote',
  'MMP': 'Mixed Member Proportional System',
  'Parallel': 'Parallel Systems',
  'LV': 'Limited Vote',
  'Modified BC': 'Modified Borda Count',
  'In transition': 'In transition',
  'No direct elections': 'No direct elections',
}

const defns = {
  'Overall': 'There are a variety of voting systems used around the world. Here are the systems used to elect each country\'s national legislature.',
  'FPTP': 'First Past The Post is the simplest form of plurality/majority electoral system. The winning candidate is the one who gains more votes than any other candidate, even if this is not an absolute majority of valid votes. The system uses single-member districts and the voters vote for candidates rather than political parties.',
  'BV': 'Block Vote is a plurality/majority system used in multi-member districts. Electors have as many votes as there are candidates to be elected. The candidates with the highest vote totals win the seats. Usually voters vote for candidates rather than parties and in most systems may use as many, or as few, of their votes as they wish.',
  'FPTP PBV': 'Party Block Vote (PBV) is a plurality/majority system using multi-member districts in which voters cast a single party-centred vote for a party of choice, and do not choose between candidates. The party with most votes will win every seat in the electoral district.',
  'AV': 'The Alternative Vote is a preferential plurality/majority system used in single-member districts. Voters use numbers to mark their preferences on the ballot paper. A candidate who receives an absolute majority (50 per cent plus 1) of valid first preference votes is declared elected. If no candidate achieves an absolute majority of first preferences, the least successful candidates are eliminated and their votes reallocated according to their second preferences until one candidate has an absolute majority. Voters vote for candidates rather than political parties.',
  'TRS': 'The Two-Round System is a plurality/majority system in which a second election is held if no candidate or party achieves a given level of votes, most commonly an absolute majority (50 per cent plus one), in the first election round. A Two-Round System may take a majority-plurality form–more than two candidates contest the second round and the one wins the highest number of votes in the second round is elected, regardless of whether they have won an absolute majority–or a majority run-off form–only the top two candidates in the first round contest the second round',
  'List PR': 'Under a List Proportional Representation (List PR) system each party or grouping presents a list of candidates for a multi-member electoral district, the voters vote for a party, and parties receive seats in proportion to their overall share of the vote. In some (closed list) systems the winning candidates are taken from the lists in order of their position on the lists. If the lists are ‘open’ or ‘free’ the voters can influence the order of the candidates by marking individual preferences.',
  'STV': 'The Single Transferable Vote is a preferential system in which the voter has one vote in a multi-member district and the candidates that surpass a specified quota of first preference votes are immediately elected. In successive counts, votes are redistributed from least successful candidates, who are eliminated, and votes surplus to the quota are redistributed from successful candidates, until sufficient candidates are declared elected. Voters normally vote for candidates rather than political parties, although a party-list option is possible.',
  'SNTV': 'Under the Single Non-Transferable Vote system voters cast a single vote in a multi-member district. The candidates with the highest vote totals are declared elected. Voters vote for candidates rather than political parties.',
  'MMP': 'Mixed Member Proportional is a mixed system in which the choices expressed by the voters are used to elect representatives through two different systems–one List PR system and (usually) one plurality/majority system–where the List PR system compensates for the disproportionality in the results from the plurality/majority system.',
  'Parallel': 'A Parallel System is a mixed system in which the choices expressed by the voters are used to elect representatives through two different systems–one List PR system and (usually) one plurality/majority system–but where no account is taken of the seats allocated under the first system in calculating the results in the second system.',
  'LV': 'Limited Vote is a candidate-centred electoral system used in multi-member districts in which electors have more than one vote, but fewer votes than there are candidates to be elected. The candidates with the highest vote totals win the seats.',
  'Modified BC': 'A modified version of Borda Count (BC) – A candidate-centred preferential system used in either single- or multimember districts in which voters use numbers to mark their preferences on the ballot paper and each preference marked is then assigned a value using equal steps. These are summed and the candidate(s) with the highest total(s) is/are declared elected.',
  'In transition': 'In transition for electoral systems.',
  'No direct elections': 'No provisions for direct elections.'
}

const landingStyle = css`
  .header {
    padding: 2em;
  }

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
    flex-basis: 18%;
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
  constructor(props) {
    super(props);
    const systems = ['Overall', 'FPTP', 'SNTV', 'List PR', 'MMP', 'Parallel', 'TRS', 'AV', 'BV', 'FPTP PBV', 'LV', 'STV', 'Modified BC', 'In transition', 'No direct elections'];
    this.state = {
    topoData: topoData,
    voteData: [],
    colorScale: null,
    svg: null,
    initialized: false,
    data: 'Overall',
    steps: systems,
    progress: 0,
    }
  }

  componentDidMount() {
    d3.csv(`${process.env.PUBLIC_URL}/data/voting-methods-country.csv`).then(res => {
      this.setState({ voteData: res });
      this.initialize();
    });

    // TODO: start out on the first
  }

  convertCountry(country) {
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

  initialize() {
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
          .entries(this.state.voteData)
          .map((d) => d.key);

      const color = d3
          .scaleOrdinal()
          .domain(systems)
          .range(["#48A36D", "#64B98C", "#80CEAA", "#7FC9BD", "#7EC4CF", "#7FB1CF", "#809ECE", "#8F90CD", "#9E81CC", "#B681BE", "#CE80B0", "#D76D8F", "#E05A6D", "#E26962", "#E37756", "#E39158", "#E2AA59", "#DFB95C", "#DBC75F", "#EAD67C"]);
      this.setState({ colorScale: color });
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
          this.update(svg, d);
        }).on('mouseout', function(d) {
        svg.select('.methods').style('cursor', 'default');
        this.update(svg, null);
    });

    svg.append('g')
        .attr('class', 'map-base')

    this.setState({ svg: svg, initialized: true });
    this.update(null);
  }

  update(system) {
    if (!this.state.initialized) {
      return;
    }

    const viz = this;

     var projection = d3
        .geoRobinson()
        .scale(160)
        .translate([viz.state.svg.attr('width') / 2 - 50, viz.state.svg.attr('height') / 2]);

     const path = d3.geoPath().projection(projection);
      var filteredVoteData;
      var entries;
     if (system && system !== 'Overall') {
         filteredVoteData = this.state.voteData.filter((d) => d["Electoral system for national legislature"] === system);
         entries = d3.nest()
             .key((d) => d.Country )
             .object(filteredVoteData);
     } else {
         entries = d3.nest()
             .key((d) => d.Country )
             .object(this.state.voteData);
     }



     const world = topojson.feature(this.state.topoData, this.state.topoData.objects.countries).features;

    var mapBase = this.state.svg.select('.map-base');

    var tooltip = d3Tip()
      .html(function(d) {
        if (entries[viz.convertCountry(d.properties.name)]) {
          return '<b>' + d.properties.name + ':</b> ' + entries[viz.convertCountry(d.properties.name)][0]["Electoral system for national legislature"];
        } else {
          return '';
        }
      })
      .style('pointer-events', 'none')
      .style('background', '#a4a7ab')
      .style('color', '#fff')
      .style('line-height', 1)
      .style('font-size', '0.8em')
      .style('padding', '8px')
      .style('border-radius', '4px')
      .style('position', 'absolute')
      .style('z-index', 100);

    mapBase.call(tooltip);


    // var tooltip = mapBase.append("div")
    //   .attr("class", "tooltip")
    //   .style('background', '#a4a7ab')
    //   .style('color', '#fff')
    //   .style('line-height', 1)
    //   .style('font-size', '0.8em')
    //   .style('padding', '8px')
    //   .style('border-radius', '4px')
    //   .style('position', 'absolute')
    //   .style('pointer-events', 'none')
    //   .style('display', 'hidden');



     var mapSelect = mapBase
        .selectAll('path')
        .data(world);

     mapSelect.exit().remove();

      var map = mapSelect.enter()
        .append('path')
        .merge(mapSelect)
        .attr('d', path)
        .attr('id', (d, i) => 'path' + i );


      // TODO: better transitions
      map.transition();

      map.attr('fill', function(d) {
            if (entries[viz.convertCountry(d.properties.name)]) {
               return viz.state.colorScale(entries[viz.convertCountry(d.properties.name)][0]["Electoral system for national legislature"]);
            } else {
              return '#eeedf0';
            }
        })
        .attr('stroke', '#dcdfe3')
        .attr('stroke-width', 1)
        .style('opacity', function(d) {
          return 1;
        })
        .on('mouseenter', function(d, i) {
          //var mouse = d3.mouse(viz.state.svg.node()).map( (d) => parseInt(d) );
          var x = event.pageX,
              y = event.pageY;
          tooltip.show(d, this);
          tooltip.style('top', y + 'px');
          tooltip.style('left', x + 'px');
          d3.select('#path' + i).style('cursor', 'pointer');
        })
        .on('mouseleave', function(d, i) {
          tooltip.hide(d, this) ;
          d3.select('#path' + i).style('cursor', 'default');
        });

  }


  onStepEnter = ({ element, data }) => {
    this.setState( { data });
    if (data) {
      this.update(data);
    }
  }

  onStepProgress = ({ element, progress }) => {
    this.setState({ progress });
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
              offset={0.2}
            >
              {steps.map ( value => (
                <Step data={value} key={value}>
                  <div className='step'>
                    <Typography component="h2">
                      {longNames[value]}
                    </Typography>
                    <Typography component="p">
                      {defns[value]}
                    </Typography>
                  </div>
                </Step>
              ))}
            </Scrollama>
           </div>
        </div>
         <Typography>
            <Link href="https://www.idea.int/data-tools/data/electoral-system-design">
            Data from IDEA
            </Link>
          </Typography>
      </div>
      )
  }
}
