/******* LTC CHLOROPLETH CHART *******/
var mapSVG = output.append("g")
			.attr("id", "map")
			.attr("width", widthOutput)
			.attr("transform","translate(0,0)");


d3.csv("data/LTC.csv", function(error, data) {
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
		.range(["#BCAF7E","#665C3C"]);

	// Load GeoJSON data and merge with states data
	d3.json("data/us-states.json", function(error, json) {
		if (error) throw error;

		var stateFeatures = json.features;

		data.forEach(function(i) {
			var dataState = i.State;
			var dataOccupancy = i.Occupancy;

			stateFeatures.forEach(function(j) {
				var jsonState = j.properties.name;
				if (dataState == jsonState) {
					j.properties.occupancy = dataOccupancy;
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
				var value = d.properties.occupancy;
				if (value > 0) { return linear(value); } else { return "#999"; }
			});
	});

	/** Per Capita Scale **/
	var mapScale = [60,70,80,90,100];

	var legendLeft = parseInt(($("#output").width() - 430)/2);

	var mapLegend = output.append("g")
		.attr("width", 430)
		.attr("height", 40)
		.attr("transform","translate(" + legendLeft + ",40)");

	var legendLinear = d3.legendColor()
	  .shapeWidth(70)
	  .cells(mapScale)
	  .labels(['60%','70%','80%','90%','100%'])
	  .orient('horizontal')
	  .scale(linear);

	mapLegend.call(legendLinear);

});