fetch(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
)
  .then((res) => res.json())
  .then((res) => {
    const { data } = res;

    barChart(data);
  });

function barChart(data) {
  const w = 800;
  const h = 500;
  const padding = 50;
  const barWidth = Number.parseFloat((w - 2 * padding) / data.length).toFixed(
    3
  );
  console.log(barWidth);

  // Convert strings into
  let years = data.map((d) => {
    return new Date(d[0].split("-")[0]);
  });

  const svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

  const tooltip = d3
    .select("#chart")
    .append("div")
    .attr("id", "tooltip")
    .style("opacity", 0);

  // Create Y-axis name
  svg
    .append("text")
    .attr("x", -330)
    .attr("y", 70)
    .attr("transform", "rotate(-90)")
    .text("Gross Domestic Product [USD billion]");

  // Create X-axis name
  svg.append("text").attr("x", 720).attr("y", 485).text("Year");

  var xMax = new Date(d3.max(years));
  xMax.setMonth(xMax.getMonth() + 7);

  const xScale = d3
    .scaleTime()
    .domain([d3.min(years), xMax])
    .range([padding, w - padding]);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d[1])])
    .range([h - padding, padding]);

  // Create bars and tooltip style
  svg
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", (d, i) => i * barWidth + padding)
    .attr("y", (d, i) => yScale(d[1]))
    .attr("width", barWidth)
    .attr("height", (d, i) => h - yScale(d[1]) - padding)
    .attr("class", "bar")
    .attr("data-date", (d, i) => d[0])
    .attr("data-gdp", (d, i) => d[1])
    .on("mouseover", (d, i) => {
      tooltip
        .style("left", i * barWidth + 70 + "px")
        .style("top", h - 170 + "px")
        .style("opacity", 0.9)
        .html(
          d[0] +
            "<br>" +
            "$" +
            d[1].toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, "$1,") +
            " " +
            "billion"
        )
        .attr("data-date", d[0]);
    })
    .on("mouseout", (d, i) => tooltip.style("opacity", 0));

  const xAxis = d3.axisBottom(xScale);

  const yAxis = d3.axisLeft(yScale);

  svg
    .append("g")
    .attr("transform", "translate(0, 450)")
    .call(xAxis)
    .attr("id", "x-axis");

  svg
    .append("g")
    .attr("transform", "translate(50, 0)")
    .call(yAxis)
    .attr("id", "y-axis");
}
