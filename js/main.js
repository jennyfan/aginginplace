// format large numbers
var formatFinancial = d3.format(".2s");
var formatThousands = d3.format(",");

// Parse date
var parseDate = d3.timeParse("%Y");

// Width and height of map
var margin = {top: 16, right: 8, bottom: 16, left: 8},
	scaleFactor = 1.1,
	widthOutput =  parseInt($("#output").width() - margin.right - margin.left),
	widthInput =  parseInt($("#input").width() - margin.right - margin.left),
	height = parseInt(widthInput * scaleFactor);

// Append SVGs for input/output
var input = d3.select("#input")
              .append("svg")
              .attr("width", widthInput)
              .attr("height", height+10);

var output = d3.select("#output")
			.append("svg")
			.attr("width", widthOutput)
			.attr("height", height);

// D3 Projection
var projection = d3.geoAlbersUsa()
				  .translate([widthOutput/2, height/2])
				  .scale(widthOutput * 1.4);

// Define path generator
var path = d3.geoPath().projection(projection);

// Tooltip: LTC Data
var tooltip = d3.select("body")
	    .append("div")   
		.attr("class", "tooltip") 
		.style("opacity", 0);

// Details: State Data
var details = d3.select("#input")
				.append("div")
				.attr("class", "overlay")
				.attr("id", "details");

// Sort functions
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

function showDetails(d) {
	// Highlight bar
    d3.select("#barChart").selectAll('g rect').classed("active", false);
    d3.select(".bar." + d.State).selectAll('rect').classed("active", true);

    // Highlight state
    d3.selectAll(".state." + d.State).selectAll("path").classed("active", true);

    // Show details
    d3.select(details).transition().style("opacity", 0.9);

    d3.select(details).html('<h1>' + d.State + '</h1><br><p>' + formatThousands(d.Users) + ' total clients</p><p>$' + parseInt(d.PerCapita) + ' spent per capita</p><p>' + d.Rural + '% rural</p><p>' + d.Alone + '% living alone</p><p>' + d.Poverty + '% in poverty</p><p>' + d.Nutrition + '% at nutrition risk</p><h2>' + d.LowCare + '% low-care residents</h2>');
}

// GO!!!
createBarChart();
createMap();