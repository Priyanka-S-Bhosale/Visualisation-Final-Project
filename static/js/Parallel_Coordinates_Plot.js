function Parallel_Coordinates_Plot(data) {

    // PCP Implementation.
    var pcp_data = JSON.parse(data);

    document.getElementById("pcp-chart").innerHTML = "";

    console.log(pcp_data);
    console.log(pcp_data.length);

    var data = pcp_data[0];

    var dimensions = pcp_data[1];
    console.log(dimensions);

    var klabel = pcp_data[2];
    var color_label = ['#b5e7a0','#d5e1df','#86af49'];
    console.log(klabel);

    var f=0;

    var margin = {top: 20, right: 100, bottom: 20, left: 100},
        width = 800 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    //append the svg object to the body of the page
    var svg = d3.select("#pcp-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scalePoint()
        .range([ 0, width ],1);

    y = {},
        dragging = {},
        highlighted = null;

    var background, foreground;

    svg.append('text')
        .attr('x', width / 2)
        .attr('y', -30)
        .attr('text-anchor', 'middle')
        .style("font-size", "34px")
        .style("text-decoration", "underline")
        .text("Parallel Coordinates Plot")

    svg.append("text")
        .attr('x', width /3)
        .attr('y', 550)
        .attr('text-anchor', 'right')
        .style("font-size", "20px")
        .text("Color Legends --> Red : Cluster 1  Yellow : Cluster 2  Blue : Cluster 3")

    axis = d3.axisLeft(),
        background,
        foreground;

    dimensions.forEach(function(attr) {
        y[attr] = d3.scaleLinear()
            .domain(d3.extent(data, function(row) { return +row[attr]; }))
            .range([height, 0]);
    });
    x.domain(dimensions);

    background = svg.append("g")
        .attr("class", "background")
        .selectAll("path")
        .data(data)
        .enter().append("path")
        .attr("d", path).style("fill", "none")
        .style("stroke", "#ddd")
        .style("shape-rendering", "crispEdges")

    foreground = svg.append("g")
        .attr("class", "foreground")
        .selectAll("path")
        .data(data)
        .enter().append("path")
        .attr("d", path)
        .style("fill", "none")
        .style("stroke", function(d,i) {
            if(f==0)
            {
                return color_label[klabel[i]]
            }
            else{
                return 'red';

            }
        })

    var g = svg.selectAll(".dimension")
        .data(dimensions)
        .enter().append("g")
        .attr("class", "dimension")
        .attr("width", 250)
        .attr("transform", function(d) { return "translate(" + x(d) + ")"; })

        .call(d3.drag()
            .on("start", function(d) {
                dragging[d] = this.__origin__ = x(d);
                background.attr("visibility", "hidden");
            })
            .on("drag", function(d) {
                dragging[d] = Math.min(width, Math.max(0, this.__origin__ += d3.event.dx));
                foreground.attr("d", path);
                dimensions.sort(function(a, b) { return position(a) - position(b); });
                x.domain(dimensions);
                g.attr("transform", function(d) { return "translate(" + position(d) + ")"; })
            })
            .on("end", function(d) {
                delete this.__origin__;
                delete dragging[d];
                d3.select(this).attr("transform", "translate(" + x(d) + ")").transition().duration(500);

                foreground.transition().duration(500).attr("d", path);
                background
                    .attr("d", path)
                    .transition()
                    .delay(500)
                    .duration(0)
                    .attr("visibility", null);
            }));

    g.append("g")
        .attr("class", "axis")
        .each(function(d) { d3.select(this).call(axis.scale(y[d])); })
        .append("text")
        .style("text-anchor", "middle")
        .attr("fill", "black")
        .attr("y", -9)
        .text(function(d) { return d; });

    // Add and store a brush for each axis.
    g.append("svg:g")
        .attr("class", "brush")
        .each(function(d) { d3.select(this).call(y[d].brush = d3.brushY()(y[d]).move("brush", brush)); })
        .selectAll("rect")
        .attr("x", -12)
        .attr("width", 24);
    g.append("g")
        .attr("class", "brush")
        .each(function(d) {
            d3.select(this).call(y[d].brush = d3.brushY(y[d]).on("brush", brush));
        })
        .selectAll("rect")
        .attr("x", -8)
        .attr("width", 16);

    function position(d) {
        var v = dragging[d];
        return v == null ? x(d) : v;
    }

    // Returns the path for a given data point.
    function path(d) {
        // return line(dimensions.map(function(p) { return [position(p), y[p](d[p])]; }));
        return  d3.line()(dimensions.map(function(key) { return [position(key), y[key](d[key])]; }));
    }
    function start() {
        d3.event.sourceEvent.stopPropagation();
    }

    // Handles a brush event, toggling the display of foreground lines.
    function brush() {
        var actives = dimensions.filter(function(p) { return !y[p].brush.empty(); }),
            extents = actives.map(function(p) { return y[p].brush.extent(); });
        console.log(actives,extents);
        foreground.style("display", function(d) {
            return actives.every(function(p, i) {
                return extents[i][0] <= d[p] && d[p] <= extents[i][1];
            }) ? null : "none";
        });
    }
}

