function Bar_Chart(data) {

    var myData = JSON.parse(data);
    console.log(myData);
    var name = 0;

    var dataNameList = [];
    var dataValArray = [];

    for (var i in myData) {
        var item = myData[i];
        for (var j in item) {
            if(name==1) {
                dataValArray.push(item[j]);
            }else if (name==2){
                dataNameList.push(item[j]);
            }
        }
        name = name+1;
    }

    console.log(dataNameList);
    console.log(dataValArray);

    var height = screen.height/4;
    var width = screen.width/4;

    var svg = d3.select("#bar-chart")
        .append("svg")
        .attr("id","bar_graph")
        .attr("width", width)
        .attr("height", height)

    var g = svg.append("g")
        .attr("transform", "translate(" + -100 + "," + -100 + ")");

    var x = d3.scaleBand().domain(dataNameList).range([height, 0]).padding(0.5);
    var y = d3.scaleLinear().domain([0, d3.max(dataValArray)]).range([0, width]);

    var xAxis = d3.axisBottom(y);
    var yAxis = d3.axisLeft(x);

    g.append("g")
        .attr("transform", "translate(100," + height + ")")
        .call(xAxis.tickFormat(function(d) {
            return d;
        }).ticks(15))
        .append("text")
        .attr("y", height - 250)
        .attr("x", width / 2)
        .attr("text-anchor", "middle")
        .attr("fill", "purple")
        .attr("font-family", "sans-serif")
        .attr("font-size", "20px")
        .text("Count");

    g.append("g")
        .attr("transform", "translate(100,0)")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0)
        .attr("x", -140)
        .attr("dy", "-5.1em")
        .attr("text-anchor", "middle")
        .attr("fill", "purple")
        .attr("font-family", "sans-serif")
        .attr("font-size", "20px")
        .text("US Data Statistics");

    g.append("g").attr("transform", "translate(100," + height + ")")
        .call(d3.axisBottom(y).tickFormat("").ticks(15).tickSizeInner(-height)).attr("class", "grid");

    g.selectAll(".bar")
        .data(dataNameList)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("fill", "#b5e7a0")
        .attr("y", function(d) { return x(d); })
        .attr("x", 100)
        .attr("height", x.bandwidth())
        .attr("width", 0 )
        .transition()
        .ease(d3.easeLinear)
        .duration(400)
        .delay(function (d, i) {
            return i * 50;
        })
        .attr("width", function(d, i) { return y(dataValArray[i]); });

}