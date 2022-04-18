function draw_geo_map() {
    var year = "2019";
    var crime = "Total-Murder";
    $.ajax({
        url: "load_us_map",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            "Year" : year,
            "Crime": crime
        })
    }).done(function (data) {
        USMap(data);
    });

}

function draw_pcp() {
    var State = "California";
    $.ajax({
        url: "parallel_coordinates_plot",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            "State" : State
        })
    }).done(function (data) {
        console.log(data);
        Parallel_Coordinates_Plot(data);
    });
}

function draw_bar_chart() {
    //state
    //crime
    var State = "California";
    var crime = "Total-Murder";

    $.ajax({
        url: "bar_chart",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            "State" : State,
            "Crime": crime
        })
    }).done(function (data) {
        Bar_Chart(data);
    });

}