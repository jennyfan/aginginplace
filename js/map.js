// format large numbers
var formatFinancial = d3.format(".2s");
var formatThousands = d3.format(",");

// Parse date
var parseDate = d3.timeParse("%Y");

// Width and height of map
var margin = {top: 20, right: 8, bottom: 20, left: 8},
	widthOutput =  parseInt($("#output").width() - margin.right - margin.left),
	widthInput =  parseInt($("#input").width() - margin.right - margin.left),
	height = parseInt(widthOutput);

// Append Div for tooltip to SVG
var tooltip = d3.select("body")
		    .append("div")   
    		.attr("class", "tooltip") 
    		.style("opacity", 0);



// Append div for details
var details = d3.select("#output").append("div").attr("id", "details");



// D3 Projection
var projection = d3.geoAlbersUsa()
				   .translate([widthOutput/2, height/2])
				   .scale([1000]);
        
// Define path generator
var path = d3.geoPath()
  	 .projection(projection);



/********* OUTPUT: LTC/NH MAP ************/
d3.csv("data/funding.csv", function(data) {

	//Create SVG element
	var output = d3.select("#output")
				.append("svg")
				.attr("width", widthOutput)
				.attr("height", height);

	// Append map to SVG
	var mapSVG = output.append("g")
				.attr("id", "map")
				.attr("width", widthOutput)
				.attr("transform","translate(0,0)");

	// Load GeoJSON data and merge with states data
	d3.json("data/us-states.json", function(json) {

		data.forEach(function(d) {
		    d.State = d.State;
		    d.Longitude = +d.Longitude;
		    d.Latitude = +d.Latitude;
		    d.Users = +d["Total Users"];
		    d.Spending = +d["Total Exp"];
		    d.PerCapita = +d["Per Capita"];
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
			

			// Find the corresponding state inside the GeoJSON
			for (var j = 0; j < json.features.length; j++)  {
				var jsonState = json.features[j].properties.name;
				if (dataState == jsonState) {
					// State expenditures
					json.features[j].properties.exp = dataPerCapita; 

					// Stop looking through the JSON
					break;
				}
			}
				
		// Bind the data to the SVG and create one path per GeoJSON feature
		mapSVG.selectAll("path")
			.data(json.features)
			.enter()
			.append("path")
			.attr("d", path)
			.style("stroke", "#fff")
			.style("stroke-width", "1")
			.style("fill", function(d) {
				// Get data value
				var value = d.properties.exp;
				if (value) {
				//If value exists…
				return linear(value);
				} else {
				//If value is undefined…
				return "#cecece";
			}
			});
	});

	// Define linear scale for output
	var linear = d3.scaleLinear()
		.domain([0,5000])
		.range(["#e5f5f9","#31a354"]);

	/** Per Capita Scale **/
	var perCapitaScale = [0,1000,2000,3000,4000,5000];

	var legendLeft = parseInt(($("#output").width() - 430)/2);

	var mapLegend = output.append("g")
		.attr("width", 430)
		.attr("height", 40)
		.attr("transform","translate(" + legendLeft + ",40)");

	var legendLinear = d3.legendColor()
	  .shapeWidth(70)
	  .cells(perCapitaScale)
	  .labels(['$0','$1000','$2000','$3000','$4000','$5000'])
	  .orient('horizontal')
	  .scale(linear);

	mapLegend.call(legendLinear);

});