/******* LTC CHLOROPLETH CHART *******/
var mapSVG = output.append("g")
			.attr("id", "map")
			.attr("width", widthOutput)
			.attr("transform","translate(0,0)");


d3.csv("data/LTC.csv", function(error, data) {
	if (error) throw error;

	var LTCdata = data;

	LTCdata.forEach(function(d) {
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
		.range(["#BCAF7E","#665C3C"]);

	// Load GeoJSON data and merge with states data
	d3.json("data/us-states.json", function(error, json) {
		if (error) throw error;

		var stateFeatures = json.features;

		LTCdata.forEach(function(i) {
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
		mapSVG.selectAll("path")
			.data(stateFeatures)
			.enter()
			.append("path")
			.attr("d", path)
			.style("fill", function(d) {
				return color(d.properties.occupancy);
			})
			.attr("class", function(d) {
				return "path " + d.properties.name;
			})
			.on("mouseover", function(d) {
				// Color the state
				d3.select(this).style("fill", "#F28532");

				// Identify selected state
				var state = d.properties.name;

				tooltip.transition().style("opacity", .9);

				tooltip.html(state)
						.style("left", (d3.event.pageX) + "px")
						.style("top", (d3.event.pageY - 28) + "px");
				// details.transition().duration(200).style("opacity", .9);
				// details.html('<b>Details</b>');
			})
			.on("mouseout", function(d) {
				d3.select(this).style("fill", color(d.properties.occupancy));

				tooltip.transition().style("opacity", 0);
			 	// details.transition().duration(200).style("opacity", 0);
			});

		// show Tooltip (Details)
		function showTooltip(state) {
			LTCdata.forEach(function(k) {
				if (state == k.State) {
					return true;
				}
			});
			// k.TotalBeds
			// d.ForProfit % for profit
			// d.Pay_mcare % Medicare
			// d.Pay_mcaid % Medicaid
			// d.Pay_other % Other
			// d.Occupancy % Occupancy
			// Average age: d.AvgAge
			// Average ADL: d.AvgADL
			// d.LowCare % Low Care
		}
	});

	// Map color
	var color = function(value) {
		if (value > 0) { return linear(value); }
		else { return "#999"; }
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
});