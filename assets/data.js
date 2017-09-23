// format large numbers
var formatFinancial = d3.format(".2s");
var formatThousands = d3.format(",");

// Width and height of map
var width = 800;
var height = 500;

// D3 Projection
var projection = d3.geoAlbersUsa()
				   .translate([width/2, height/2])    // translate to center of screen
				   .scale([1000]);          // scale things down so see entire US
        
// Define path generator
var path = d3.geoPath()
  	 .projection(projection);
		
// Define linear scale for output
var linear = d3.scaleLinear()
	// .domain([0,500000000])
	.domain([0,5000])
	.range(["#e5f5f9","#31a354"]);

//Create SVG element and append map to the SVG
var map = d3.select("#map")
			.append("svg")
			.attr("width", width)
			.attr("height", height);
        
// Append Div for tooltip to SVG
var tooltip = d3.select("body")
		    .append("div")   
    		.attr("class", "tooltip") 
    		.style("opacity", 0);

var clientInfo = d3.select("#clients");

/******* Loading state funding data ***********/
	d3.csv("data/overall.csv", function(data) {
		// Load GeoJSON data and merge with states data
		d3.json("data/us-states.json", function(json) {

			// Loop through each state data value in the .csv file
			for (var i = 0; i < data.length; i++) {

				// Grab data
				var dataState = data[i]['State'];
				// var dataExp = parseInt(data[i]['Total Exp']);
				var dataPerCapita = parseInt(data[i]['Per Capita']);

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
			}
					
			// Bind the data to the SVG and create one path per GeoJSON feature
			map.selectAll("path")
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
			/** 
			map.selectAll("circle")
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
					// return Math.sqrt(d['Total Users']/100);
					return Math.sqrt(d['Per Capita']/2);
				})
				.style("fill", "#43a2ca")	
				.style("opacity", 0.5)
				.on("mouseover", function(d) {
					d3.select(this).style("opacity", 0.7);

			    	tooltip.transition() 
			      	   .duration(200)      
			           .style("opacity", .9);
			        tooltip.html('<b>' + d['State'] + ':</b> ' + formatThousands(d['Total Users']) + ' clients<br /><b>Expenditures:</b> $' + formatFinancial(d['Total Exp']) + '<br /><b>Spending per capita: $' + d['Per Capita'] + '</b><br><b>Funded by Title III:</b> ' + d['% Title III Exp'] + '<br /><b>Senior Centers:</b> ' + d['Total Senior Centers'])
			           .style("left", (d3.event.pageX) + "px")     
			           .style("top", (d3.event.pageY - 28) + "px"); 

					clientInfo.transition() 
			      	   .duration(200)      
			           .style("opacity", .9);
			        clientInfo.html(
			        	'<b>Client demographics of ' + d['State'] + ':</b><br />' + d['% Male'] + ' male, ' + d['% Female'] + ' female<br />' + d['% Rural'] + ' rural<br />' + d['% Living Alone'] + ' living alone<br />' + d['% Minority'] + ' minority<br>' + d['% Poverty'] + ' poverty<br>' + d['% Nutrition Risk'] + ' nutrition risk')
				})           
			    .on("mouseout", function(d) {
					d3.select(this).style("opacity",0.3);

			        tooltip.transition()        
			           .duration(200)      
			           .style("opacity", 0);

			        clientInfo.transition()        
			           .duration(200)      
			           .style("opacity", 0);
			    });
			    **/

			// d3 legend scale
			/** Total Exp Scale **/
			/** 
			var scaleArray = [0,100000000,200000000,300000000,400000000,500000000];

			var mapLegend = d3.select("#mapLegend")
				.append("g");

			var legendLinear = d3.legendColor()
			  .shapeWidth(70)
			  .cells(scaleArray)
			  .labels(['$0','$100MM','$200MM','$300MM','$400MM','$500MM'])
			  .orient('horizontal')
			  .scale(linear);
			**/

			/** Per Capita Scale **/

			var scaleArray = [0,1000,2000,3000,4000,5000];

			var mapLegend = d3.select("#mapLegend")
				.append("g");

			var legendLinear = d3.legendColor()
			  .shapeWidth(70)
			  .cells(scaleArray)
			  .labels(['$0','$1000','$2000','$3000','$4000','$5000'])
			  .orient('horizontal')
			  .scale(linear);

			mapLegend.call(legendLinear);

			/**
			var circleLegend = d3.select("#circleLegend").append("g");

			circleLegend.append("circle")
				.attr("cx", 20)
				.attr("cy", 20)
				.attr("r", 20)
				.style("fill", "#43a2ca")	
				.style("opacity", 0.5);

		  	circleLegend.append("text")
		      .attr("x", 48)
		      .attr("y", 20)
		      .attr("dy", ".35em")
		      .text("Spending per capita");
		    **/
		});
	});


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

	d3.csv("data/programs.csv", function(error, data) {
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


/******* Loading normalized bar chart *******/
/** 
var svg = d3.select("svg"),
    margin = {top: 20, right: 60, bottom: 30, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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

d3.csv("data.csv", type, function(error, data) {
  if (error) throw error;

  data.sort(function(a, b) { return b[data.columns[1]] / b.total - a[data.columns[1]] / a.total; });

  x.domain(data.map(function(d) { return d.State; }));
  z.domain(data.columns.slice(1));

  var serie = g.selectAll(".serie")
    .data(stack.keys(data.columns.slice(1))(data))
    .enter().append("g")
      .attr("class", "serie")
      .attr("fill", function(d) { return z(d.key); });

  serie.selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
      .attr("x", function(d) { return x(d.data.State); })
      .attr("y", function(d) { return y(d[1]); })
      .attr("height", function(d) { return y(d[0]) - y(d[1]); })
      .attr("width", x.bandwidth());

  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y).ticks(10, "%"));

  var legend = serie.append("g")
      .attr("class", "legend")
      .attr("transform", function(d) { var d = d[d.length - 1]; return "translate(" + (x(d.data.State) + x.bandwidth()) + "," + ((y(d[0]) + y(d[1])) / 2) + ")"; });

  legend.append("line")
      .attr("x1", -6)
      .attr("x2", 6)
      .attr("stroke", "#000");

  legend.append("text")
      .attr("x", 9)
      .attr("dy", "0.35em")
      .attr("fill", "#000")
      .style("font", "10px sans-serif")
      .text(function(d) { return d.key; });
});

function type(d, i, columns) {
  for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
  d.total = t;
  return d;
}
***/