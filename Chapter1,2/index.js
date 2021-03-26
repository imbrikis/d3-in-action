const svg = d3.select('#container')

// const arr = [14, 68, 24500, 430, 19, 1000, 5555]

const fetchCSV = async () => {
  let tempArr = []
  const res = await d3.csv('cities.csv', (d) => {
    tempArr.push(d)
  })
  const csvData = await Array.from(
    d3.group(tempArr, (d) => d.label),
    ([city, data]) => ({ city, data })
  )
  // dataViz(csvData)
}

const fetchJSON = async () => {
  let tempArr = []
  const res = await d3.json('tweets.json')
  tempArr = res.tweets
  // const nestedTweets = Array.from(d3.group(tempArr, d => d.user), (([key, values]) => ({key, values})))
  // nestedTweets.forEach(d => d.numTweets = d.values.length)
  // console.log(nestedTweets)
  // dataViz(nestedTweets)
  dataViz(tempArr)
}

fetchCSV()
fetchJSON()

const dataViz = (data) => {
  // const maxPopulation = d3.max(data, d => +d.data[0].population)
  // const yScale = d3.scaleLinear().domain([0, maxPopulation]).range([0, 460])
  // const maxTweets = d3.max(data, d => d.numTweets)
  // const yScale = d3.scaleLinear().domain([0, maxTweets]).range([0, 460])
  data.forEach((d) => {
    d.impact = d.favorites.length + d.retweets.length
    d.tweetTime = new Date(d.timestamp)
  })
  let maxImpact = d3.max(data, (d) => d.impact)
  let startEnd = d3.extent(data, (d) => d.tweetTime)
  let timeRamp = d3.scaleTime().domain(startEnd).range([20, 480])
  let yScale = d3.scaleLinear().domain([0, maxImpact]).range([0, 460])
  let radiusScale = d3.scaleLinear().domain([0, maxImpact]).range([1, 20])
  let colorScale = d3
    .scaleLinear()
    .domain([0, maxImpact])
    .range(['white', '#75739F'])

  svg
    .selectAll('circle')
    .data(data, JSON.stringify())
    .enter()
    .append('circle')
    .attr('r', (d) => radiusScale(d.impact))
    .attr('cx', (d) => timeRamp(d.tweetTime))
    .attr('cy', (d) => 480 - yScale(d.impact))
    .style('fill', (d) => colorScale(d.impact))
    .style('stroke', 'chartreuse')
    .style('stroke-width', '1px')

  let filteredData = data.filter((d) => d.impact > 0)
  d3.selectAll('circle')
    .data(filteredData, (d) => JSON.stringify(d))
    .exit()
    .remove()

  //   let tweetG = svg.selectAll('g')
  //   	.data(data)
  //   	.enter()
  //   	.append('g')
  //   	.attr('transform', d => `translate(${timeRamp(d.tweetTime)}, ${480 - yScale(d.impact)})`)

  //   tweetG.append('circle')
  //   	.attr('r', d => radiusScale(d.impact))
  //   	.style('fill', '#75739F')
  //   	.style('stroke', 'black')
  //   	.style('stroke-width', '1px')

  //   tweetG.append('text')
  //   	.text(d => `${d.user} - ${d.tweetTime.getHours()}`)

  //   selectAll('g').data([1, 2, 3, 4]).exit().remove()
  //   selectAll('g').select('text').text(d => d)

  //   selectAll('g').each(d => console.log(d))
  //   selectAll('text').each(d => console.log(d))
  //   selectAll('circle').each(d => console.log(d))
}

// FROM THE BOOK - DOES NOT WORK
//
// function dataViz(incomingData) {
//  	d3.select('body')
//     .selectAll('div.cities')
//   	.data(incomingData)
//   	.enter()
//   	.append('div')
//   	.attr('class', 'cities')
//   	.html(d => d.label)
// }

// d3.csv('cities.csv', (error, data) => {
//  	if (error) {
//    	console.error(error)
//   }
//   else {
//    	dataViz(data)
//   }
// })
