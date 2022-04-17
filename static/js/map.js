/*
The input I get to plot Map: Year and Crime !
 */
function USMap(data) {
    console.log(data);

    var data = JSON.parse(data);
    var state = data['State'];
    var value = data[Object.keys(data)[1]];

    var height = 300;
    var width = 600;

    var lowColor = '#f2f7f7';
    var highColor = '#057a7a';

    // Projection
    var projection = d3.geoAlbersUsa()
                         .translate([width / 2, height / 2])
                         .scale([500]);

    // Define path generator
    var path = d3.geoPath() //
                 .projection(projection);

    //Create SVG element and append map to the SVG
    var svg = d3.select("body")
                .append("svg").attr("id","my_map_svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform","translate(" + 10 + "," + 0 + ")");


    svg.append("text")
        .attr("x", -40+ (width / 2))
        .attr("y", 3 + (20 / 2))
        .attr("text-anchor", "middle")
        .attr("font-family", "myriad pro")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text("Murder Crimes in Year 2019 in U.S.")
        .style("z-index",10);

    $("#my_map_svg").css({top:100,left:720, position:"absolute"});

    var values = Object.keys(value).map(function(key) {
        return value[key];
    });

    var minVal = d3.min(values)
    var maxVal = d3.max(values)

    var ramp = d3.scaleLinear().domain([minVal,maxVal]).range([lowColor,highColor]);

    d3.json("static/us-states-data.json", function(json) {

        for (var j = 0; j < json.features.length; j++) {
            json.features[j].properties.value = 0;
        }

        for (var i = 0; i < 42; i++) {
            var dataState = state[i];
            var dataValue = value[i];

            for (var j = 0; j < json.features.length; j++) {
                var jsonState = json.features[j].properties.name;
                if (dataState == jsonState) {
                    json.features[j].properties.value = dataValue;
                    break;
                }
            }
        }

        var div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        svg.selectAll("path")
            .data(json.features)
            .enter()
            .append("path")
            .attr("d", path)
            .style("stroke", "#fff")
            .style("stroke-width", "1")
            .style("fill", function(d) { return ramp(d.properties.value) })
            .on("mouseover", function(d) {
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div.html(d.properties.name)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px")
            })
            .on("mouseout", function(d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);

            })
            .on("click", function(d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        var w = 50, h = 180;

        var key = d3.select("body")
            .append("svg").attr("id","my_map_svg")
            .attr("width", w)
            .attr("height", h)
            .attr("class", "legend")
            .attr("transform",
                "translate(" + 780 + "," + 100 + ")");

        var legend = key.append("defs")
            .append("svg:linearGradient")
            .attr("id", "gradient")
            .attr("x1", "100%")
            .attr("y1", "0%")
            .attr("x2", "100%")
            .attr("y2", "100%")
            .attr("spreadMethod", "pad");

        legend.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", highColor)
            .attr("stop-opacity", 1);

        legend.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", lowColor)
            .attr("stop-opacity", 1);

        key.append("rect")
            .attr("width", w - 40)
            .attr("height", h)
            .style("fill", "url(#gradient)")
            .attr("transform", "translate(0,10)");

        var y = d3.scaleLinear()
            .range([h-10, 0])
            .domain([minVal, maxVal]);

        var yAxis = d3.axisRight(y);

        key.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(10,10)")
            .call(yAxis)
    });

}