/******* LTC CHLOROPLETH CHART *******/
function createMap() {

	var mapSVG = output.append("g")
				.attr("id", "map")
				.attr("width", widthOutput)
				.attr("transform","translate(0,0)");


	d3.csv("data/combined.csv", function(error, data) {
		if (error) throw error;

		data.forEach(function(d) {
		    d.State = d.State;
		    d.TotalBeds = +d.TotalBeds;
		    d.ForProfit = +d.ForProfit;
		    d.Pay_mcare = +d.Pay_mcare;
		    d.Pay_mcaid = +d.Pay_mcaid;
		    d.Pay_other = +d.Pay_other;
		    d.Occupancy = +d.Occupancy;
		    d.AvgAge = +d.AvgAge;
		    d.AvgADL = +d.AvgADL;
		    d.LowCare = +d.LowCare;
		});

		// Define linear scale for output
		var linear = d3.scaleLinear()
			.domain([60,100])
			.range(["#e5dbb7","#665C3C"]);

		// Load GeoJSON data and merge with states data
		d3.json("data/us-states.json", function(error, json) {
			if (error) throw error;

			var stateFeatures = json.features;

			data.forEach(function(i) {
				var LTCState = i.State;
				var LTCOccupancy = i.Occupancy;

				stateFeatures.forEach(function(j) {
					var jsonState = j.properties.name;
					if (LTCState == jsonState) {
						j.properties.occupancy = LTCOccupancy;
					}
				})
			});

			// Bind the data to the SVG and create one path per GeoJSON feature
			var states = mapSVG.selectAll("path")
				.data(stateFeatures)
				.enter()
				.append("g")
				.attr("class", function(d) {
					return "state " + d.properties.name;
				})
				.on("mouseover", function(d) {
					// Color the state
					d3.select(this).selectAll('path').classed("active", true);
				})
				.on("mouseout", function(d) {
					d3.select(this.parentNode).selectAll('g path').classed("active", false);

					d3.select(this).selectAll('path').style("fill", color(d.properties.occupancy));
				});

			states.append("path")
				.transition()
				.duration(500)
				.attr("d", path)
				.delay(function(d, i) {
					return i * 10;
				})
				.style("fill", function(d) {
					return color(d.properties.occupancy);
				});

			// d3.selectAll(".state").select("path")
			// 	.data(data)
			// 	.enter()
			// 	.on("mouseover", function(d) {
			// 		console.log(d);

			// 		tooltip.transition().style("opacity", .9);
   //                	tooltip.html('<p>' + d.State + '</p><p>' + d.ForProfit + '% for-profit nursing homes</p><p>' + d.Pay_mcaid + '% Medicaid / ' + d.Pay_mcare + '% Medicare</p><p>' + d.Pay_other + '% patients not uncovered</p><p>Average Age: ' + d.AvgAge + '</p><p>Average ADL Index (out of 28): ' + d.AvgADL + '</p>')
		 //                .style("left", (d3.event.pageX) + "px")
		 //                .style("top", (d3.event.pageY) + "px");
			// 	})
			// 	.on("mouseout", function(d) {
			// 		tooltip.transition().style("opacity", 0);
			// 	});


			// Add circle points
			// mapSVG.selectAll("circle")
		 //        .data(data)
		 //        .enter()
		 //        .append("circle")
			// 	.attr("class", function(d) {
			// 		return "point " + d.State;
			// 	})
		 //        .attr("cx", function(d) {
		 //        	return projection([d.Longitude, d.Latitude])[0];
		 //        })
		 //        .attr("cy", function(d) {
		 //        	return projection([d.Longitude, d.Latitude])[1];
		 //        })
		 //        .attr("r", function(d) {
		 //        	return Math.sqrt(d.LowCare);
		 //        })
		 //        .style("opacity", 0);

		});

		// Map color
		var color = function(value) {
			if (value > 0) { return linear(value); }
			else { return "#333"; }
		};

		/** Per Capita Scale **/
		var mapScale = [60,70,80,90,100];

		var legendLeft = parseInt(($("#output").width() - 430)/2 + 30);

		var mapLegend = output.append("g")
			.attr("class", "mapLegend")
			.attr("transform","translate(" + legendLeft + ",20)");

		var legendLinear = d3.legendColor()
		  .shapeWidth(70)
		  .cells(mapScale)
		  .labels(['60%','70%','80%','90%','100%'])
		  .orient('horizontal')
		  .scale(linear);

		mapLegend.call(legendLinear);
	})
}