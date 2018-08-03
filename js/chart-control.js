


function buildGraph(data){

    info = data.sales_details
    $("#f-sls").text(info.total_sales)
    $("#f-exp").text(info.total_expenses)
    $("#f-prf").text(info.total_profit)
    $("#f-dbt").text(info.total_debts)
    $("#f-coh").text(info.total_coh)
    
    lbl = []
    sls = []
    time_data = data.individual_sales
    for(day in time_data){
        var date = day.split("-")
            var y = date[0]
            var m = b(date[1])
            var d = date[2]
            // .toFixed(2)
        var s = parseFloat(time_data[day])
      
        sls.push(s)
        lbl.push(d)
    }

    var salesGraph = document.getElementById('line').getContext('2d')
    var chart = new Chart(salesGraph, {
        type: 'line',
        data: {
            labels: lbl,
            datasets: [{
                fill: "false",
                label: "Sales Graph",
                backgroundColor: 'transparent',
                pointBorderColor: 'transparent',
                borderColor: 'rgb(86, 131, 255)',
                data: sls,
            }]
        },
        options: {
            maintainAspectRatio: false,
            legend: {
                display: false,
                labels: {
                    display: true
                }
            }
        }
    });
    salesGraph.height = 600;

}






    var config = {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [
                        48,43,65,72,84,
                    ],
                    backgroundColor: [
                   '#4A73E0', '#4064C2', '#3654A4', '#24396E', '#3654A4',
                   
                    ],
                    label: 'Sales'
                }],
                labels: [
                    'Website',
                    'Logo',
                    'Social Media',
                    'Adwords',
                    'E-Commerce'
                ]
            },
            options: {
                cutoutPercentage: 60,
                maintainAspectRatio: false,
                responsive: true,
                legend: {
                    position: 'right',
                },
                animation: {
                    animateScale: true,
                    animateRotate: true
                }
            }
        };

window.onload = function() {
    Chart.defaults.global.legend.labels.usePointStyle = true;
    // var ctx = document.getElementById('doughnut').getContext('2d');
    // window.myDoughnut = new Chart(ctx, config);
    // ctx.height = 600;

    // $('.dropdown-trigger').dropdown()
    
};





