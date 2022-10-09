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

    // creating x and y scales and axis
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

    // creating a scale for population
    const popScale = d3.scaleLinear();
    popScale.domain(d3.extent(data, d => d.Population));
    popScale.range([4, 30]);

    // creating ordinal scales
    let regionArray = ["Sub-Saharan Africa", "South Asia", "East Asia & Pacific", "Middle East & North Africa", "America", "Europe & Central Asia"];
    const ordinalScale = d3.scaleOrdinal()
        .domain(regionArray)
        .range(d3.schemeTableau10);


    const svg = d3.select(".chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    // let maxIncome = d3.max(data, d => d.Income);
    // console.log(xScaleIncome(maxIncome)); // return width



    // creating tooltips
    let tooltip = d3.select('.tooltip')
        .style('opacity', 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px");
    // adding circles
    svg
        .selectAll()
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', d => xScale(d.Income))
        .attr('cy', d => yScale(d.LifeExpectancy))
        .attr('r', d => popScale(d.Population))
        .style('fill', d => ordinalScale(d.Region))
        .on("mouseenter", (event, d) => {
            let pos = d3.pointer(event, window); // pos = [x,y]
            tooltip
                .style("opacity", 1)
                .html("Country: " + d.Country + "<br/>Region: " +
                    d.Region + "<br/>Population: " + d3.format(",")(d.Population) + "<br/>Income: "
                    + d3.format(",")(d.Income) + "<br/>Life Expectancy: " + d.LifeExpectancy)
                .style("left", pos[0] + 'px')
                .style("top", pos[1] + 'px');
        })
        .on("mouseleave", (event, d) => {
            tooltip
                .style("opacity", 0);

        });

    // Draw the axis
    svg.append("g")
        .attr("class", "axis x-axis")
        .call(xAxis)
        .attr("transform", `translate(0, ${height})`);


    // Draw the axis
    svg.append("g")
        .attr("class", "axis y-axis")
        .call(yAxis);

    // adding titles to the axis
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



    svg.append("g")
        .attr("class", "legend")
        .selectAll()
        .data(ordinalScale.domain())
        .enter()
        .append("rect")
        .attr("x", width - 200)
        .attr("y", (d, i) => height - 40 - i * 20)
        .attr("width", 10)
        .attr("height", 10)
        .style('fill', ordinalScale);


    svg.append("g")
        .attr("class", "legend-label")
        .selectAll()
        .data(ordinalScale.domain())
        .enter()
        .append("text")
        .attr("x", width - 180)
        .attr("y", (d, i) => height - 30 - i * 20)
        .text(d => d)
        

})




