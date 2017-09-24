/******* Loading pie chart ***********/
var radius = 48;

var arc = d3.arc()
    .outerRadius(radius)
    .innerRadius(radius - 25);

var pie = d3.pie()
    .sort(null)
    .value(function(d) { return d.program; });
      
var color = d3.scaleOrdinal()
    .range(['#67001f','#b2182b','#d6604d','#f4a582','#fddbc7','#f7f7f7','#d1e5f0','#92c5de','#4393c3','#2166ac','#053061']);


d3.csv("data/LTV.csv", function(error, data) {
  if (error) throw error;

  color.domain(d3.keys(data[0]).filter(function(key) { 
  	return (key !== "State" && key !== "Total" && key !== "");
  }));

  data.forEach(function(d) {
    d.programs = color.domain().map(function(name) {
      return {name: name, program: +d[name]};
    });
  });

  var detailLegend = d3.select("#detailLegend")
      .selectAll("g")
      .data(color.domain().slice().reverse())
      .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  detailLegend.append("rect")
      .attr("width", 18)
      .attr("class", function(d) { return d; })
      .attr("height", 18)
      .style("fill", color);

  detailLegend.append("text")
      .attr("x", 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .text(function(d) { return d; });

  var detailSvg = d3.select("#detailPie").selectAll(".pie")
      .data(data)
      .enter().append("svg")
      .attr("class", "pie")
      .attr("width", radius * 2)
      .attr("height", radius * 2)
      .append("g")
      .attr("transform", "translate(" + radius + "," + radius + ")");

  detailSvg.selectAll(".arc")
      .data(function(d) { return pie(d.programs); })
      .enter().append("path")
      .attr("class", "arc")
      .attr("d", arc)
      .style("fill", function(d) { return color(d.data.name); })
      .on("mouseover", function(d) {
        tooltip.transition() 
               .duration(200)      
               .style("opacity", .9);
        tooltip.html("" + d.data.name + ": " + d.data.program)
               .style("left", (d3.event.pageX) + "px")
               .style("top", (d3.event.pageY - 28) + "px")
      })
      .on("mouseout", function(d) {
        tooltip.transition()        
               .duration(200)      
               .style("opacity", 0);
        });

  detailSvg.append("text")
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .text(function(d) { return d.State; });
});