const margin = ({ top: 20, right: 20, bottom: 20, left: 20 })
const width = 650 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
d3.csv('wealth-health-2014.csv', d => {
    return {
        ...d,
        Population: +d.Population,
        Income: +d.Income,
        LifeExpectancy: +d.LifeExpectancy,
    }
}).then(data => {
    console.log(data);



    const xScale = d3
        .scaleLinear()
        .domain(d3.extent(data, d => d.Income))
        .range([0, width]);
    const xAxis = d3.axisBottom()
        .scale(xScale)
        .ticks(5, "s");
    const yScale = d3
        .scaleLinear()
        .domain(d3.extent(data, d => d.LifeExpectancy))
        .range([height, 0]);
    const yAxis = d3.axisLeft()
        .scale(yScale)
        .ticks(5, "s");

    const svg = d3.select(".chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    // let maxIncome = d3.max(data, d => d.Income);
    // console.log(xScaleIncome(maxIncome)); // return width


    svg
        .selectAll()
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', d => xScale(d.Income))
        .attr('cy', d => yScale(d.LifeExpectancy))
        .attr('r', 4)
        .style('fill', 'lightblue');


    // Draw the axis
    svg.append("g")
        .attr("class", "axis x-axis")
        .call(xAxis)
        .attr("transform", `translate(0, ${height})`);


    // Draw the axis
    svg.append("g")
        .attr("class", "axis y-axis")
        .call(yAxis);


    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height - 10)
        .text("Income");

   svg.append("text")
        .attr("class", "textY")
        .attr("text-anchor", "end")
        .attr("x", 10)
        .attr("y", 100)
        .text("Life Expectancy");

})




