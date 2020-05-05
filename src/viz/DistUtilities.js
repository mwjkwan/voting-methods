/** @jsx jsx */
import { scaleLinear } from 'd3-scale';
import { sum } from 'd3-array';

const d3 = { scaleLinear, sum };

function normal (mu, sigma_squared) {
  const sqrt = Math.sqrt, powidth = Math.pow, e = Math.E, pi = Math.PI;
  const sigma = sqrt(sigma_squared);
  const a = 1 / (sigma * sqrt(2 * pi));
  return (function(xi) {
      return Math.pow( a * e, - Math.pow(xi - mu, 2) / (2 * Math.pow(sigma, 2)) )
    });
}

function distribution (type) {
  if (type == "normal") {
    return normal(0, 1);
  }
  if (type == "uniform") {
    return (function(_xi) {
      return 0.5;
    })
  }
  else {
    return (function(xi) {
      return ((normal(-5, 0.9))(xi) + (normal(5, 0.9))(xi))/1.5;
    })
  }
}

function groupData (data, total) {
  // use scale to get percent values
  const percent = d3.scaleLinear()
    .domain([0, total])
    .range([0, 100])
  // filter out data that has zero values
  // also get mapping for next placement
  // (save having to format data for d3 stack)
  let cumulative = 0
  const _data = data.map(d => {
    cumulative += d.value
    return {
      value: d.value,
      // want the cumulative to prior value (start of rect)
      cumulative: cumulative - d.value,
      label: d.id,
      percent: percent(d.value)
    }
  }).filter(d => d.value > 0)
  return _data
}

function integrate (f, start, end) {
  const step_size = 0.01;
  let total = 0;
  for (let x = start; x < end; x += step_size) {
    total += step_size*f(x);
  }
  return total;
}

// Plurality FPTP tallying
function tallyFPTP (f, data, start, end) {
  const step_size = 0.01;
  let _data = [...data];
  let totals = {};
  // initialize tallies
  for (let i = 0; i < data.length; i++) {
    totals[data[i].id] = 0;
  }
  // Round 1
  for (let x = start; x < end; x += step_size) {
    _data = _data.sort((a, b) => Math.abs(x-a.xpos) - Math.abs(x-b.xpos));
    totals[_data[0].id] += step_size*f(x);
  }
  
  return totals;
}

// Bucklin RCV tallying
function tallyRCV (f, data, start, end) {
  const step_size = 0.01;
  let _data = [...data];
  const totals = tallyFPTP(f, data, start, end);
  const total_area = integrate(start, end);
  console.log(integrate(start, end));
  function unfinished (data) {
    data.every((e) => {return e < 0.5*d3.sum(data)})
  }
  let round = 0;
  console.log(Object.values(totals));
  while (round < data.length) {
    for (let x = start; x < end; x += step_size) {
      _data = _data.sort((a, b) => Math.abs(x-a.xpos) - Math.abs(x-b.xpos));
      totals[_data[round].id] += (1.0/(round+1))*step_size*f(x);
    }
    round++;
    console.log("MADE IT");
    console.log(totals);
  }
  return totals;
}

export {
  normal as normal,
  distribution as distribution,
  groupData as groupData,
  integrate as integrate,
  tallyFPTP as tallyFPTP,
  tallyRCV as tallyRCV,
}