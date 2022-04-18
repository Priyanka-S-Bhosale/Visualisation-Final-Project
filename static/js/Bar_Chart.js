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

    var svg = d3.select("#mysvg"),
        margin = 200,
        width = svg.attr("width") - margin,
        height = svg.attr("height") - margin;

    var x = d3.scaleBand().range([0, width]).padding(0.5);
    var y = d3.scaleLinear().range([height, 0]);

    var g = svg.append("g")
        .attr("transform", "translate(" + 100 + "," + 100 + ")");


    x.domain(dataNameList);
    y.domain([0, d3.max(dataValArray)]);


    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .append("text")
        .attr("y", height - 250)
        .attr("x", width/2)
        .attr("text-anchor", "middle")
        .attr("fill", "purple")
        .attr("font-family", "sans-serif")
        .attr("font-size", "20px")
        .text("label")

    g.append("g")
        .call(d3.axisLeft(y).tickFormat(function(d){
            return  d;
        }).ticks(10))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 50)
        .attr("x", -140)
        .attr("dy", "-5.1em")
        .attr("text-anchor", "middle")
        .attr("fill", "purple")
        .attr("font-family", "sans-serif")
        .attr("font-size", "20px")
        .text("Count");

    g.append("g")
        .call(d3.axisLeft(y).tickFormat("").ticks(10).tickSizeInner(-width)).attr("class", "grid");

    g.selectAll(".bar")
        .data(dataNameList)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("fill", "purple")
        .attr("x", function(d) { return x(d); })
        .attr("y", height)
        .attr("height", 0)
        .attr("width", x.bandwidth())
        .transition()
        .ease(d3.easeLinear)
        .duration(400)
        .delay(function (d, i) {
            return i * 50;
        })
        .attr("y", function(d, i) { return y(dataValArray[i]); })
        .attr("height", function(d, i) { return height - y(dataValArray[i]); })


}