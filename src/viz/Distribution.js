/** @jsx jsx */
import React, { Component } from 'react';
import { css, jsx } from '@emotion/core';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup'
import ToggleButton from 'react-bootstrap/ToggleButton'
import { select, selectAll, mouse } from 'd3-selection';
import { csv } from 'd3-fetch';
import { path } from 'd3-path';
import { scaleOrdinal, scaleLinear, scaleBand } from 'd3-scale';
import { transition } from 'd3-transition';
import { nest } from 'd3-collection';
import { axisBottom, axisTop, axisLeft } from 'd3-axis';
import { line } from 'd3-shape';
import { format } from 'd3-format';
import { range, sum } from 'd3-array';
import { drag } from 'd3-drag';
import { normal, distribution, groupData, integrate, tallyFPTP, tallyRCV } from './DistUtilities';


const d3 = { axisBottom, axisLeft, axisTop, drag, range, format, select, selectAll, line, mouse, csv, path, scaleOrdinal, transition, scaleBand, scaleLinear, nest, sum };

const style = css`
  .toggle {
    text-align: center;
    display: inline-block;
  }
`
;

export default class Distribution extends Component {
  constructor(props) {
    super(props);
    this.state = {
      svg: null,
      initialized: false,
      candidates: [
        {id: "Candidate A", xpos: -3, color: "#ed4f3a", value: 1},
        {id: "Candidate B", xpos: 0, color: "#2994d2", value: 1},
        {id: "Candidate C", xpos: 5, color: "#95C7F5", value: 1},
        {id: "Candidate D", xpos: 7, color: "#C9E4E4", value: 1},
      ],
      continuous: distribution(this.props.dist),
      }
    }

  componentDidMount() {
    this.initialize();
  }

  update() {
    console.log('updating');
    var svg = this.state.svg;
    var parentWidth = d3
      .select('.distribution')
      .node()
      .getBoundingClientRect().width;
    const margin = { top: 0, right: 0, bottom: 0, left: 50 };
    var width = parentWidth - margin.left - margin.right;
    this.setState({svg: svg, width: parentWidth});
  }

  initialize() {
    Promise.all([
      this.scaffoldDistribution(),
      this.scaffoldBarCharts('.fptpBarchart', this.state.candidates, tallyFPTP),
      this.scaffoldBarCharts('.rcvBarchart', this.state.candidates, tallyRCV),
    ]).then(() => {
        this.make_rules();
        this.chart_line();
        this.renderCandidates();
    });
  }

  scaffoldDistribution() {
    const { candidates } = this.state;
    var parentWidth = d3
      .select('.distribution')
      .node()
      .getBoundingClientRect().width;
    const margin = { top: 0, right: 0, bottom: 0, left: 50 };
  
    var width = parentWidth - margin.left - margin.right;
    var height = 300 - margin.top - margin.bottom;
    var radius = 10;
    var pad = 50;

    var x = d3.scaleLinear().domain([-10, 10]).range([0, width]);
    var y = d3.scaleLinear().domain([ 0, 1.1]).range([height, 0]);
    this.setState({width, height, x, y})

    var svg = d3.select(".distribution")
        .append("svg:svg")
        .attr("height", height + pad)
        .attr("width",  width + pad)

    var vis = svg.append("svg:g")
        .attr("transform", "translate(40,20)")

    var guides = vis.append("svg:g")
      .classed("guides", true)
      .attr("stroke-width", "1px");

    // store svg info
    this.setState({initialized: true, guides: guides, svg: svg, vis: vis});
  }

  scaffoldBarCharts(bind, data, tallyFunction) {
    var parentWidth = d3
      .select('.distribution')
      .node()
      .getBoundingClientRect().width;

    const config = {
      f: d3.format('.1f'),
      margin: {top: 20, right: 10, bottom: 20, left: 10},
      width: parentWidth,
      height: 100,
      barHeight: 50,
      colors: ["#ed4f3a", "#2994d2", "#95C7F5", '#C9E4E4', '#ff7f00', '#ffff33'],
    }
    const { f, margin, width, height, barHeight, colors } = config
    const w = width - margin.left - margin.right
    const h = height - margin.top - margin.bottom
    const halfBarHeight = barHeight / 2
  
    const total = d3.sum(data, d => d.value)
    const _data = groupData(data, total)
  
    // set up scales for horizontal placement
    const xScale = d3.scaleLinear()
      .domain([0, total])
      .range([0, w])
  
    // create svg in passed in div
    const selection = d3.select(bind)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
  
    // stack rect for each data value
    selection.selectAll('rect')
      .data(_data)
      .enter().append('rect')
      .attr('class', 'rect-stacked')
      .attr('x', d => xScale(d.cumulative))
      .attr('y', h / 2 - halfBarHeight)
      .attr('height', barHeight)
      .attr('width', d => xScale(d.value))
      .style('fill', (d, i) => colors[i])
  
    // add some labels for percentages
    selection.selectAll('.text-value')
      .data(_data)
      .enter().append('text')
      .attr('class', 'text-value')
      .attr('text-anchor', 'middle')
      .attr('text-color', 'white')
      .attr('x', d => xScale(d.cumulative) + (xScale(d.value) / 2))
      .attr('y', (h / 2) + 5)
      .text(d => f(d.percent) + ' %')
  }
  
  renderCandidates () {
    const { vis, candidates, continuous, x, y } = this.state;
    const points = candidates.map(({id, xpos, color}) => {
      vis.append("circle")
            .classed("candidate", true)
            .attr("id", id)
            .attr("r",10)
            .attr("color",color)
            .attr("cx", x(xpos))
            .attr("cy", y(continuous(xpos)))
            .attr("fill", color)
            .attr("stroke", "#348")
            .attr("opacity", "0.8")
    })

    let drag = d3.drag()
                .on('start', dragstarted)
                .on('drag', dragged)
                .on('end', dragended);

    function updateBarChart (bind, data) {
      var parentWidth = d3
          .select('.distribution')
          .node()
          .getBoundingClientRect().width;

      const config = {
        f: d3.format('.1f'),
        margin: {top: 20, right: 10, bottom: 20, left: 10},
        width: parentWidth,
        height: 100,
        barHeight: 50,
        colors: ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33'],
      }
      const { f, margin, width, height, barHeight, colors } = config
      const w = width - margin.left - margin.right
      const h = height - margin.top - margin.bottom
      const halfBarHeight = barHeight / 2
    
      const total = d3.sum(data, d => d.value)
      const _data = groupData(data, total)
    
      // set up scales for horizontal placement
      const xScale = d3.scaleLinear()
        .domain([0, total])
        .range([0, w])
        d3.select(bind).selectAll("*").remove();
        const selection = d3.select(bind)
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

      // stack rect for each data value
      selection.selectAll('rect')
        .data(_data)
        .enter().append('rect')
        .attr('class', 'rect-stacked')
        .attr('x', d => xScale(d.cumulative))
        .attr('y', h / 2 - halfBarHeight)
        .attr('height', barHeight)
        .attr('width', d => xScale(d.value))
        .style('fill', (d, i) => data[i].color)
        

      // add some labels for percentages
      selection.selectAll('.text-value')
        .data(_data)
        .enter().append('text')
        .attr('class', 'text-value')
        .attr('text-anchor', 'middle')
        .attr('text-color', 'white')
        .attr('x', d => xScale(d.cumulative) + (xScale(d.value) / 2))
        .attr('y', (h / 2) + 5)
        .text(d => f(d.percent) + ' %')
    }
    
    function dragstarted() {
      d3.select(this).raise().classed('active', true);
    }
      
    function dragged() {
      const xi = x.invert(d3.mouse(this)[0]);
      if (xi <= 10.0 && xi >= -10.0) {
        d3.select(this)
          .attr('cx', x(xi))
          .attr('cy', y(continuous(xi)));
      }
    }
      
    function dragended() {
      d3.select(this).classed('active', false);
      
      let positions = [];
      d3.selectAll("circle").each(function(d, i) {
        let id = d3.select(this).attr("id");
        let xpos = x.invert(d3.select(this).attr("cx"));
        let color = d3.select(this).attr("color");
        positions = [...positions, {id, xpos, color}];
      })
      positions = positions.sort((a, b) => a.xpos - b.xpos);

      const fptpTallies = tallyFPTP(continuous, positions, -10, 10);
      const rcvTallies = tallyRCV(continuous, positions, -10, 10);
      const fptpData = positions.map(({id, xpos, color}) => {
        return ({id, xpos, color, value: fptpTallies[id]})
      });
      const rcvData = positions.map(({id, xpos, color}) => {
        return ({id, xpos, color, value: rcvTallies[id]})
      });

      updateBarChart('.fptpBarchart', fptpData)
      updateBarChart('.rcvBarchart', rcvData)
    }

    d3.selectAll("circle")
      .call(drag);
  }

  make_gaussian_func (mu, sigma_squared) {
    // per: http://en.wikipedia.org/wiki/Gaussian_function
    // and: http://mathworld.wolfram.com/GaussianFunction.html
    var sqrt = Math.sqrt, powidth = Math.pow, e = Math.E, pi = Math.PI;
    var sigma = sqrt(sigma_squared);
    var a = 1 / (sigma * sqrt(2 * pi));
    return (function(xi) {
        return Math.pow( a * e, - Math.pow(xi - mu, 2) / (2 * Math.pow(sigma, 2)) )
      });
  }

  make_uniform_func () {
    return (function(_xi) {
      return 0.5
    })
  }

  chart_line() {
    const { vis, x, y, continuous } = this.state;
    var g = vis.append("svg:g")
        .classed("series", true)
  
    g.append("svg:path")
        .attr("d", function(d) { return d3.line()(
          x.ticks(100).map(function(xi) {
            return [ x(xi), y(continuous(xi)) ]
          })
         )})
        .attr("fill", "none")
        .attr("stroke", "#348")
        .attr("stroke-width", "3px")
  }

  make_rules() {
    const { vis, width, height, x, y } = this.state;
    var rules = vis.append("svg:g").classed("rules", true)
  
    function make_x_axis() {
      return d3.axisBottom(x)
          .ticks(10)
    }
  
    function make_y_axis() {
      return d3.axisLeft(y)
          .ticks(10)
    }
  
    rules.append("svg:g").classed("grid x_grid", true)
        .attr("transform", "translate(0,"+height+")")
        .attr("opacity", "0.2")
        .call(make_x_axis()
          .tickSize(-height,0,0)
          .tickFormat("")
        )
  
    rules.append("svg:g").classed("grid y_grid", true)
        .attr("opacity", "0.2")
        .call(make_y_axis()
          .tickSize(-width,0,0)
          .tickFormat("")
        )
  
    rules.append("svg:g").classed("labels x_labels", true)
        .attr("transform", "translate(0,"+height+")")
        .call(make_x_axis()
          .tickSize(5)
          // .tickFormat(d3.time.format("%Y/%m"))
        )
  }

  

  render() {
    return (
      <div css={style}>
        <div className='main'>
          <div className='distribution'>
          </div>
          <h3>FPTP Results</h3>
          <div className='fptpBarchart'>
          </div>
          <h3>RCV Results (Borda)</h3>
          <div className='rcvBarchart'>
          </div>
        </div>
      </div>
      )
  }
}