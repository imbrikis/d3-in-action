import { colorbrewer } from './colorbrewer.js'

const svg = d3.select('#container')

d3.csv('worldcup.csv').then((data) => overallTeamViz(data))
d3.text('./resources/infobox.html').then((html) => {
  d3.select('body').append('div').attr('id', 'infobox').html(html)
})
d3.html('./resources/icon.svg').then((svgData) => {
  // while (!d3.select(svgData).selectAll('path').empty()) {
  //   d3.select('svg')
  //     .node()
  //     .appendChild(d3.select(svgData).select('path').node())
  // }
  // ----- OR -----
  d3.select(svgData)
    .selectAll('path')
    .each(function () {
      d3.select('svg').node().appendChild(this)
    })
  d3.selectAll('path').attr('transform', 'translate(50,50)')
})

function overallTeamViz(data) {
  svg
    .append('g')
    .attr('id', 'teamsG')
    .attr('transform', 'translate(50, 300)')
    .selectAll('g')
    .data(data)
    .enter()
    .append('g')
    .attr('class', 'overallG')
    .attr('transform', (d, i) => `translate(${i * 50}, 0)`)

  let teamG = d3.selectAll('g.overallG')

  teamG
    .append('circle')
    .attr('r', 0)
    .transition()
    .delay((d, i) => i * 100)
    .duration(500)
    .attr('r', 40)
    .transition()
    .duration(500)
    .attr('r', 20)

  teamG
    .append('text')
    .attr('y', 30)
    .text((d) => d.team)

  teamG
    .insert('image', 'text')
    .attr('xlink:href', (d) => `images/${d.team}.png`)
    .attr('width', '45px')
    .attr('height', '20px')
    .attr('x', -22)
    .attr('y', -10)

  const dataKeys = Object.keys(data[0]).filter(
    (d) => d !== 'team' && d !== 'region'
  )

  const buttonClick = (event, dataPoint) => {
    let maxValue = d3.max(data, (d) => +d[dataPoint])
    let colorQuantize = d3
      .scaleQuantize()
      .domain([0, maxValue])
      .range(colorbrewer.Reds[5])
    let tenColorScale = d3
      .scaleOrdinal()
      .domain(['UEFA', 'CONMEBOL', 'CAF', 'AFC'])
      .range(d3.schemeCategory10)
    let radiusScale = d3.scaleLinear().domain([0, maxValue]).range([2, 20])
    let ybRamp = d3
      .scaleLinear()
      .interpolate(d3.interpolateHsl)
      .domain([0, maxValue])
      .range(['blue', 'yellow'])

    d3.selectAll('g.overallG')
      .select('circle')
      .transition()
      .duration(1000)
      .style('fill', (d) => colorQuantize(d[dataPoint]))
      .attr('r', (d) => radiusScale(d[dataPoint]))
  }

  d3.select('#controls')
    .selectAll('button.teams')
    .data(dataKeys)
    .enter()
    .append('button')
    .on('click', buttonClick)
    .html((d) => d)

  function highlightRegion(event, dataPoint) {
    let teamColor = d3.rgb('#75739F')
    d3.select(this).select('text').classed('active', true).attr('y', 10)

    d3.selectAll('g.overallG')
      .select('circle')
      .style('fill', (d) =>
        d.region === dataPoint.region
          ? teamColor.darker(0.75)
          : teamColor.brighter(0.5)
      )
    // .each(function (d) {
    //   d.region === dataPoint.region ?
    //     select(this).classed('active', true) :
    //     select(this).classed('inactive', true)
    // })
    d3.select(this).raise()
  }

  function unhighlight() {
    d3.selectAll('g.overallG').select('circle').attr('class', '')

    d3.selectAll('g.overallG')
      .select('text')
      .classed('active', false)
      .attr('y', 30)
  }

  function teamClick(event, dataPoint) {
    d3.selectAll('td.data')
      .data(Object.values(dataPoint))
      .html((d) => d)
  }

  teamG.select('text').style('pointer-events', 'none')

  teamG.on('mouseover', highlightRegion)
  teamG.on('mouseout', unhighlight)

  teamG.on('click', teamClick)
}
