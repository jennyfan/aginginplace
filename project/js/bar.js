/******* FUNDING BAR CHART *******/
var fundingSVG = input.append("g");

// Bar chart scales and axes
var x = d3.scaleLinear().rangeRound([0, widthInput - 70]);
var y = d3.scaleBand().rangeRound([height, 0]);

var xAxis = d3.axisBottom().scale(x);
var yAxis = d3.axisLeft().scale(y);

// var xAxisGroup = fundingSVG.append("g")
//     .attr("class", "x-axis axis");

var yAxisGroup = fundingSVG.append("g")
    .attr("class", "y-axis axis");


d3.csv("data/funding.csv", function(error, data) {
  if (error) throw error;

  data.forEach(function(d) {
      d.State = d.State;
      d.StateShort = d.StateShort;
      d.Longitude = +d.Longitude;
      d.Latitude = +d.Latitude;
      d.Users = +d["Total Users"];
      d.Spending = +d["Total Exp"];
      d.PerCapita = +d["PerCapita"];
      d.SpendingTitleIII = +d["% Title III Exp"];
      d.Male = +d["% Male"];
      d.Female = +d["% Female"];
      d.Rural = +d["% Rural"];
      d.Alone = +d["% Living Alone"];
      d.Minority = +d["% Minority"];
      d.Poverty = +d["% Poverty"];
      d.Both = +d["% Minority & Poverty"];
      d.Nutrition = +d["% Nutrition Risk"];
  });

  // Per Capita Funding
  sortAsc(data, "PerCapita");

  function sortAsc(data, field) {
    data.sort(function(a, b) {
      return a[field] - b[field];
    })
  }

  function sortDesc(data, field) {
    data.sort(function(a, b) {
      return b[field] - a[field];
    })
  }

  x.domain([0, d3.max(data, function(d) { return d.PerCapita; })]);
  y.domain(data.map(function(d) { return d.StateShort; })).padding(0.1);


  // ---- DRAW BARS ---- //
  var chart = fundingSVG
    .attr("transform","translate(30,0)")
    .selectAll(".bar")
    .data(data);

  var barHeight = y.bandwidth();

  chart.exit().remove();

  var bars = chart.enter().append("g");

  bars.append("rect")
      .attr("class", "bar")
      .merge(bars)
      .attr("x", 1)
      .attr("y", function(d) { return y(d.StateShort); })
      .attr("width", function(d){ return x(d.PerCapita); })
      .attr("height", barHeight)
      .on("mouseover", function(d) {
        details.html('<h2>' + d.State + '</h2>');
      })
      .on("mouseout", function(d) {
        details.transition().style("opacity", 0);
      });

  // ---- DRAW TEXT LABELS ---- //
  bars.append("text")
      .attr("class","label")
      .attr("x", function(d) { return x(d.PerCapita) + 5; })
      .attr("y", function(d) { return y(d.StateShort) + (barHeight/2); } )
      .attr("dy", "0.35em")
      .text(function(d) { 
          return "$" + parseInt(d.PerCapita);
      });

  // ---- DRAW AXIS ---- //
  // xAxisGroup = fundingSVG.select(".x-axis")
  //     .attr("transform", "translate(0," + height + ")")
  //     .call(xAxis);

  yAxisGroup = fundingSVG.select(".y-axis").call(yAxis);

});