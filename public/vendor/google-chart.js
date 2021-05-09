google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

function drawChart(dataTable) {
    // var data = google.visualization.arrayToDataTable([
    //     ['Year', 'Sales', 'Expenses'],
    //     ['2004',  1000,      400],
    //     ['2005',  1170,      460],
    //     ['2006',  660,       1120],
    //     ['2007',  1030,      540]
    // ]);

    var data = google.visualization.arrayToDataTable(dataTable);

    var options = {
        title: 'Company ',
        curveType: 'function',
        legend: { position: 'bottom' }
    };

    var chart = new google.visualization.LineChart(document.getElementById('temperature_chart'));

    chart.draw(data, options);
}
