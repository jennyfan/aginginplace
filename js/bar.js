/******* FUNDING BAR CHART *******/
var input = d3.select("#input")
              .append("svg")
              .attr("width", widthInput)
              .attr("height", height);

var fundingSVG = input.append("g").attr("transform", "translate(0,0)");

// Bar Chart  Scales
var x = d3.scaleBand()
    .rangeRound([0, width])
    .padding(0.1)
    .align(0.1);

var y = d3.scaleLinear()
    .rangeRound([height, 0]);

var z = d3.scaleOrdinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

var stack = d3.stack()
    .offset(d3.stackOffsetExpand);


d3.csv("data/funding.csv", type, function(error, data) {
  if (error) throw error;


  // Per Capita Funding
  data.sort(function(a, b) { return b[Per Capita] - a[Per Capita] });

  x.domain([0, d3.max(data, function(d) { return d.height_px; })]);

  y.domain(data.map(function(d) { return d.building; })).padding(0.2);


  // ---- DRAW BARS ---- //
  var chart = svg.selectAll(".bar")
      .data(data);

  var barHeight = y.bandwidth();

  chart.exit().remove();

  var bars = chart.enter()
      .append("g");

  bars.append("rect")
      .attr("class", "bar")
      .merge(bars)
      .attr("x", 1)
      .attr("y", function(d) { return y(d.building); })
      .attr("width", function(d){ return x(d.height_px); })
      .attr("height", barHeight)
      .on("click", function(d) {
          tooltip.transition().duration(100).style("opacity", 1);
          tooltip.html('<img src="img/' + d.image + '"><h2>' + d.building + '</h2><ul><li>Height: ' + d.height_m + 'm, ' + d.height_ft + ' ft</li><li>City: ' + d.city + '</li><li>Floors: ' + d.floors + '</li><li>Year of completion: ' + d.completed + '</li></ul>');
      });
  
  // ---- DRAW TEXT LABELS ---- //
  bars.append("text")
      .attr("class","label")
      .attr("x", function(d) { return x(d.height_px) + 10; })
      .attr("y", function(d) { return y(d.building) + (barHeight/2); } )
      .attr("dy", "0.35em")
      .text(function(d) { 
          return d.height_m + "m";
      });

  // ---- DRAW AXIS ---- //
  xAxisGroup = svg.select(".x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  yAxisGroup = svg.select(".y-axis")
      .attr("transform", "translate(0,0)")
      .call(yAxis);

});