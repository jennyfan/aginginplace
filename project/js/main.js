// format large numbers
var formatFinancial = d3.format(".2s");
var formatThousands = d3.format(",");

// Parse date
var parseDate = d3.timeParse("%Y");

	// Width and height of map
	var margin = {top: 16, right: 8, bottom: 16, left: 8},
		scaleFactor = 1.2,
		widthOutput =  parseInt($("#output").width() - margin.right - margin.left),
		widthInput =  parseInt($("#input").width() - margin.right - margin.left),
		height = parseInt(widthInput * scaleFactor);

	// Append div for details
	var details = d3.select("#output").append("div").attr("id", "details");

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
					  .scale(widthOutput * scaleFactor);

// Define path generator
var path = d3.geoPath().projection(projection);

// Append Div for tooltip to SVG
var tooltip = d3.select("body")
	    .append("div")   
		.attr("class", "tooltip") 
		.style("opacity", 0);