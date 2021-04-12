const svg = d3.select('#container')

d3.json('./tweets.json').then((data) => histogram(data.tweets))

const histogram = (tweetsData) => {
  const xScale = d3.scaleLinear().domain([0, 5]).range([0, 500])
  const yScale = d3.scaleLinear().domain([0, 10]).range([400, 0])
  const xAxis = d3.axisBottom().scale(xScale).ticks(5)
  const histoChart = d3.histogram()
  histoChart
    .domain([0, 5])
    .thresholds([0, 1, 2, 3, 4, 5])
    .value((d) => d.favorites.length)

  let histoData = histoChart(tweetsData)
  console.log(histoData)

  const retweets = () => {
    histoChart.value((d) => d.retweets.length)
    histoData = histoChart(tweetsData)
    d3.selectAll('rect')
      .data(histoData)
      .transition()
      .duration(500)
      .attr('x', (d) => xScale(d.x0))
      .attr('y', (d) => yScale(d.length))
      .attr('height', (d) => 400 - yScale(d.length))
  }

  svg
    .selectAll('rect')
    .data(histoData)
    .enter()
    .append('rect')
    .attr('x', (d) => xScale(d.x0))
    .attr('y', (d) => yScale(d.length))
    .attr('width', (d) => xScale(d.x1 - d.x0) - 2)
    .attr('height', (d) => 400 - yScale(d.length))
    .style('fill', '#FCD88B')
    .on('click', retweets)

  svg
    .append('g')
    .attr('id', 'xAxisG')
    .attr('transform', 'translate(0,400)')
    .call(xAxis)
  d3.select('.xAxisG').selectAll('text').attr('dx', 50)
}
