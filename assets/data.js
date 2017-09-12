/* Example code: http://bl.ocks.org/michellechandra/0b2ce4923dc9b5809922 */

//Width and height of map
var width = 800;
var height = 500;

// D3 Projection
var projection = d3.geoAlbersUsa()
				   .translate([width/2, height/2])    // translate to center of screen
				   .scale([1000]);          // scale things down so see entire US
        
// Define path generator
var path = d3.geoPath()               // path generator that will convert GeoJSON to SVG paths
  	 .projection(projection);  // tell path generator to use albersUsa projection

		
// Define linear scale for output
/*
	var color = d3.scale.linear()
  	.range(['#f0f9e8','#0868ac']);
*/

var linear = d3.scaleLinear()
	.domain([0,500000000])
	.range(["#e5f5f9","#31a354"]);

// format large numbers
var formatFinancial = d3.format(".2s");
var formatThousands = d3.format(",");

//Create SVG element and append map to the SVG
var svg = d3.select("body")
			.append("svg")
			.attr("width", width)
			.attr("height", height);
        
// Append Div for tooltip to SVG
var tooltip = d3.select("body")
		    .append("div")   
    		.attr("class", "tooltip") 
    		.style("opacity", 0);

var client = d3.select("body")
			.append("div")
			.attr("id", "client");

// Load funding data
d3.csv("assets/funding.csv", function(data) {
	// color.domain([0, 250000]);

	// Load GeoJSON data and merge with states data
	d3.json("assets/us-states.json", function(json) {

		// Loop through each state data value in the .csv file
		for (var i = 0; i < data.length; i++) {

			// Grab data
			var dataState = data[i]['State'];
			var dataExp = parseInt(data[i]['Total Exp']);

			// Find the corresponding state inside the GeoJSON
			for (var j = 0; j < json.features.length; j++)  {
				var jsonState = json.features[j].properties.name;
				if (dataState == jsonState) {
					// Copy the data value into the JSON
					json.features[j].properties.exp = dataExp; 
					// Stop looking through the JSON
					break;
					}
			}
		}
				
		// Bind the data to the SVG and create one path per GeoJSON feature
		svg.selectAll("path")
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
				 
		// Overlaying circles for funding
		svg.selectAll("circle")
			.data(data)
			.enter()
			.append("circle")
			.attr("cx", function(d) {
				return projection([d.Longitude, d.Latitude])[0];
			})
			.attr("cy", function(d) {
				return projection([d.Longitude, d.Latitude])[1];
			})
			.attr("r", function(d) {
				return Math.sqrt(d['Total Users']/100);
			})
			.style("fill", "#43a2ca")	
			.style("opacity", 0.5)
			.on("mouseover", function(d) {
				d3.select(this).style("opacity", 0.7);

		    	tooltip.transition() 
		      	   .duration(200)      
		           .style("opacity", .9);
		        tooltip.html('<b>' + d['State'] + ':</b> ' + formatThousands(d['Total Users']) + ' clients<br /><b>Expenditures:</b> $' + formatFinancial(d['Total Exp']) + '<br /><b>Funded by Title III:</b> ' + d['% Title III Exp'] + '<br /><b>Senior Centers:</b> ' + d['Total Senior Centers'])
		           .style("left", (d3.event.pageX) + "px")     
		           .style("top", (d3.event.pageY - 28) + "px"); 

				client.transition() 
		      	   .duration(200)      
		           .style("opacity", .9);
		        client.html(
		        	'<b>Client demographics of ' + d['State'] + ':</b><br />' + d['% Male'] + ' male, ' + d['% Female'] + ' female<br />' + d['% Rural'] + ' rural<br />' + d['% Living Alone'] + ' living alone<br />' + d['% Minority'] + ' minority<br>' + d['% Poverty'] + ' poverty<br>' + d['% Nutrition Risk'] + ' nutrition risk')
			})           
		    .on("mouseout", function(d) {
				d3.select(this).style("opacity",0.3);

		        tooltip.transition()        
		           .duration(200)      
		           .style("opacity", 0);

		        client.transition()        
		           .duration(200)      
		           .style("opacity", 0);
		    });

		// d3 legend scale
		var scaleArray = [0,100000000,200000000,300000000,400000000,500000000];

		var legendSvg = d3.select(".legend")
			.append("g");

		var legendLinear = d3.legendColor()
		  .shapeWidth(70)
		  .cells(scaleArray)
		  .labels(['$0','$100MM','$200MM','$300MM','$400MM','$500MM'])
		  .orient('horizontal')
		  .scale(linear);


		legendSvg.call(legendLinear);

	});
});
