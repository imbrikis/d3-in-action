const svg = d3.select('#container')
const width = 500
const height = 500

d3.csv('./movies.csv').then((data) => streamgraph(data))

const streamgraph = (data) => {
  console.log(data)

  const fillScale = d3
    .scaleOrdinal()
    .domain(['titanic', 'avatar', 'akira', 'frozen', 'deliverance', 'avengers'])
    .range(['#fcd88a', '#cf7c1c', '#93c464', '#75734F', '#5eafc6', '#41a368'])
  const xScale = d3.scaleLinear().domain([1, 10]).range([20, 470])
  const yScale = d3.scaleLinear().domain([0, 55]).range([480, 20])

  const xAxis = d3
    .axisBottom()
    .scale(xScale)
    .tickSize(480)
    .tickValues([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

  const yAxis = d3.axisRight().scale(yScale).ticks(10).tickSize(480)

  svg.append('g').attr('id', 'xAxisG').call(xAxis)
  svg.append('g').attr('id', 'yAxisG').call(yAxis)

  d3.selectAll('.tick > line').style('stroke', 'lightgray')
  d3.selectAll('.domain').style('stroke', 'lightgray')

  const simpleStacking = (lineData, lineKey) => {
    var newHeight = 0
    Object.keys(lineData).every((key) => {
      if (key !== 'day') {
        newHeight += parseInt(lineData[key])
        if (key === lineKey) {
          return false
        }
      }
      return true
    })
    return newHeight
  }

  Object.keys(data[0]).forEach((key) => {
    if (key != 'day') {
      const movieArea = d3
        .area()
        .x((d) => xScale(d.day))
        .y0((d) => yScale(simpleStacking(d, key) - d[key]))
        .y1((d) => yScale(simpleStacking(d, key)))
        .curve(d3.curveBasis)

      svg
        .append('path')
        .attr('id', key + 'Area')
        .attr('d', movieArea(data))
        .attr('fill', fillScale(key))
        .attr('stroke', 'black')
        .attr('stroke-width', 1)
    }
  })
}

// SECTION 4.4
// d3.csv('./tweetData.csv').then((data) => lineChart(data))

// const lineChart = (data) => {
//   console.log(data)

//   const blue = '#5eaec5',
//     green = '#92c463',
//     orange = '#fe9a22'
//   const xScale = d3.scaleLinear().domain([1, 10.5]).range([20, 480])
//   const yScale = d3.scaleLinear().domain([0, 35]).range([480, 20])
//   const xAxis = d3
//     .axisBottom()
//     .scale(xScale)
//     .tickSize(480)
//     .tickValues([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
//   const yAxis = d3.axisRight().scale(yScale).ticks(10).tickSize(480)

//   const lambdaXScale = (d) => xScale(d.day)

//   const lineGenerator = (yAccessor, curve) => {
//     let generatedLine = d3
//       .line()
//       .x(lambdaXScale)
//       .y((d) => yScale(d[yAccessor]))
//       .curve(curve)

//     return generatedLine(data)
//   }

//   svg
//     .append('path')
//     .attr('d', lineGenerator('tweets', d3.curveBasis))
//     .attr('fill', 'none')
//     .attr('stroke', orange)
//     .attr('stroke-width', 2)

//   svg
//     .append('path')
//     .attr('d', lineGenerator('retweets', d3.curveStep))
//     .attr('fill', 'none')
//     .attr('stroke', blue)
//     .attr('stroke-width', 2)

//   svg
//     .append('path')
//     .attr('d', lineGenerator('favorites', d3.curveCardinal))
//     .attr('fill', 'none')
//     .attr('stroke', green)
//     .attr('stroke-width', 2)

//   svg.append('g').attr('id', 'xAxisG').call(xAxis)
//   svg.append('g').attr('id', 'yAxisG').call(yAxis)

//   d3.selectAll('.tick > line').style('stroke', 'lightgray')
//   d3.selectAll('.domain').style('stroke', 'lightgray')

//   svg
//     .selectAll('circle.tweets')
//     .data(data)
//     .enter()
//     .append('circle')
//     .attr('class', 'tweets')
//     .attr('r', 5)
//     .attr('cx', (d) => xScale(d.day))
//     .attr('cy', (d) => yScale(d.tweets))
//     .style('fill', orange)

//   svg
//     .selectAll('circle.retweets')
//     .data(data)
//     .enter()
//     .append('circle')
//     .attr('class', 'retweets')
//     .attr('r', 5)
//     .attr('cx', (d) => xScale(d.day))
//     .attr('cy', (d) => yScale(d.retweets))
//     .style('fill', blue)

//   svg
//     .selectAll('circle.favorites')
//     .data(data)
//     .enter()
//     .append('circle')
//     .attr('class', 'favorites')
//     .attr('r', 5)
//     .attr('cx', (d) => xScale(d.day))
//     .attr('cy', (d) => yScale(d.favorites))
//     .style('fill', green)
// }

// Section 4.3
// const tickSize = 470

// const scatterplot = (data) => {
//   const xScale = d3.scaleLinear().domain([1, 8]).range([20, tickSize])
//   const yScale = d3
//     .scaleLinear()
//     .domain([0, 100])
//     .range([tickSize + 10, 20])

//   const yAxis = d3.axisRight().scale(yScale).ticks(8).tickSize(tickSize)

//   svg.append('g').attr('id', 'yAxisG').call(yAxis)

//   const xAxis = d3
//     .axisBottom()
//     .scale(xScale)
//     .tickSize(-tickSize)
//     .tickValues([1, 2, 3, 4, 5, 6, 7])

//   svg
//     .append('g')
//     .attr('transform', `translate(0, ${tickSize + 10})`)
//     .attr('id', 'xAxisG')
//     .call(xAxis)

//   svg
//     .selectAll('circle.median')
//     .data(data)
//     .enter()
//     .append('circle')
//     .attr('class', 'tweets')
//     .attr('r', 5)
//     .attr('cx', (d) => xScale(d.day))
//     .attr('cy', (d) => yScale(d.median))
//     .style('fill', 'darkgray')

//   svg
//     .selectAll('g.box')
//     .data(data)
//     .enter()
//     .append('g')
//     .attr('class', 'box')
//     .attr(
//       'transform',
//       (d) => `translate(${xScale(d.day)}, ${yScale(d.median)})`
//     )
//     .each(function (d, i) {
//       d3.select(this)
//         .append('line')
//         .attr('class', 'range')
//         .attr('x1', 0)
//         .attr('x2', 0)
//         .attr('y1', yScale(d.max) - yScale(d.median))
//         .attr('y2', yScale(d.min) - yScale(d.median))
//         .style('stroke', 'black')
//         .style('stroke-width', '4px')

//       d3.select(this)
//         .append('line')
//         .attr('class', 'max')
//         .attr('x1', -10)
//         .attr('x2', 10)
//         .attr('y1', yScale(d.max) - yScale(d.median))
//         .attr('y2', yScale(d.max) - yScale(d.median))
//         .style('stroke', 'black')
//         .style('stroke-width', '4px')

//       d3.select(this)
//         .append('line')
//         .attr('class', 'min')
//         .attr('x1', -10)
//         .attr('x2', 10)
//         .attr('y1', yScale(d.min) - yScale(d.median))
//         .attr('y2', yScale(d.min) - yScale(d.median))
//         .style('stroke', 'black')
//         .style('stroke-width', '4px')

//       d3.select(this)
//         .append('rect')
//         .attr('class', 'range')
//         .attr('width', 20)
//         .attr('x', -10)
//         .attr('y', yScale(d.q3) - yScale(d.median))
//         .attr('height', yScale(d.q1) - yScale(d.q3))
//         .style('fill', 'white')
//         .style('stroke', 'black')
//         .style('stroke-width', '2px')

//       d3.select(this)
//         .append('line')
//         .attr('x1', -10)
//         .attr('x2', 10)
//         .attr('y1', 0)
//         .attr('y2', 0)
//         .style('stroke', 'darkgray')
//         .style('stroke-width', '4px')
//     })
// }

// d3.csv('./boxPlots.csv').then((data) => scatterplot(data))

// Section 4.08
//
// const scatterData = [
//   { friends: 5, salary: 22000 },
//   { friends: 3, salary: 18000 },
//   { friends: 10, salary: 88000 },
//   { friends: 0, salary: 180000 },
//   { friends: 27, salary: 56000 },
//   { friends: 8, salary: 74000 },
//   { friends: 5, salary: 100000 },
// ]

// const xExtent = d3.extent(scatterData, (d) => d.salary)
// const yExtent = d3.extent(scatterData, (d) => d.friends)
// const xScale = d3.scaleLinear().domain(xExtent).range([0, width])
// const yScale = d3.scaleLinear().domain(yExtent).range([0, height])

// const xAxis = d3.axisBottom().scale(xScale).tickSize(500).ticks(4)
// svg.append('g').attr('id', 'xAxisG').call(xAxis)

// const yAxis = d3.axisRight().scale(yScale).ticks(16).tickSize(500)
// svg.append('g').attr('id', 'yAxisG').call(yAxis)

// svg
//   .selectAll('circle')
//   .data(scatterData)
//   .enter()
//   .append('circle')
//   .attr('r', 10)
//   .attr('cx', (d) => xScale(d.salary))
//   .attr('cy', (d) => yScale(d.friends))
