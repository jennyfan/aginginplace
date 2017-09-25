/******* FUNDING BAR CHART *******/
function createBarChart() {

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


  d3.csv("data/combined.csv", function(error, data) {
    if (error) throw error;

    // console.log(data.map(function(d) { return d.StateShort; }));

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
        d.Nutrition = +d["% Nutrition Risk"];
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

    // Per Capita Funding
    sortAsc(data, "PerCapita");

    x.domain([0, d3.max(data, function(d) { return d.PerCapita; })]);
    y.domain(data.map(function(d) { return d.StateShort; })).padding(0.1);

    var barHeight = y.bandwidth();

    // ---- DRAW BARS ---- //
    var chart = fundingSVG.attr("transform","translate(30,0)")
      .attr("id","barChart")
      .selectAll("g")
      .data(data)
      .enter()
      .append("g")
      .attr("class", function(d) {
        return "bar " + d.State;
      })
      .style("fill", function(d) {
        if (d.LowCare > 15) {
          return "#993300";
        } else {
          return "#BCAF7E";
        }
      })
      .on("click mouseover", function(d) {
        // showDetails(d);

        d3.select("#barChart").selectAll('g rect').classed("active", false);
        d3.select(".bar." + d.State).selectAll('rect').classed("active", true);

        // Highlight state
        d3.selectAll(".state." + d.State).selectAll("path").classed("active", true);

        // Show details
        details.transition().style("opacity", 0.9);

        details.html('<h3>' + d.State + '</h3><h2>' + d.LowCare + '% low-care residents</h2><p>' + formatThousands(d.Users) + ' total clients</p><p>$' + parseInt(d.PerCapita) + ' spent per capita</p><p>' + d.Rural + '% rural</p><p>' + d.Alone + '% living alone</p><p>' + d.Poverty + '% in poverty</p><p>' + d.Nutrition + '% at nutrition risk</p><br><p>' + d.ForProfit + '% for-profit nursing homes</p><p>' + d.Pay_mcaid + '% Medicaid / ' + d.Pay_mcare + '% Medicare</p><p>' + d.Pay_other + '% patients not uncovered</p><p>Average Age: ' + d.AvgAge + '</p><p>Average ADL Index (out of 28): ' + d.AvgADL + '</p>');
      })
      .on("mouseout", function(d) {
        d3.selectAll(".state." + d.State).selectAll("path").classed("active", false);

        // tooltip.transition().style("opacity", 0);
      });

    // ---- DRAW TEXT LABELS ---- //
    chart.append("text")
        .attr("class","label")
        .attr("y", function(d) { return y(d.StateShort) + (barHeight/2); } )
        .attr("dy", "0.35em")
        .transition()
        .duration(1000)
        .attr("x", function(d) { return x(d.PerCapita) + 5; })
        .text(function(d) { 
            return "$" + parseInt(d.PerCapita);
        });

    // ---- DRAW AXIS ---- //
    // xAxisGroup = fundingSVG.select(".x-axis")
    //     .attr("transform", "translate(0," + height + ")")
    //     .call(xAxis);
    yAxisGroup = fundingSVG.select(".y-axis").call(yAxis);

    var bars = chart.append("rect")
      .attr("x", 0)
      .attr("y", function(d) { return y(d.StateShort); })
      .attr("height", barHeight)
      .transition()
      .duration(500)
      .attr("width", function(d) { return x(d.PerCapita); });
  });
}

    // SORT BUTTONS
    /*
    d3.select("#sortAsc").on("click", function() {
      chart.sort(function(a, b) { 
        return d3.ascending(a.value, b.value);
      }).transition()
        .duration(1000)
        .attr("transform", function(d) {
          return "translate(0," + y(d.StateShort) + ")";
        })
    });

    d3.select("#sortDesc").on("click", function() {
      chart.sort(function(a, b) { 
        return d3.descending(a.value, b.value);
      }).transition()
        .duration(1000)
        .attr("transform", function(d) {
          return "translate(0," + y(d.StateShort) + ")";
        })
    });
    */