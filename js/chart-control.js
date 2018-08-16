


function buildGraph(data){

    var info = data.sales_details
    $("#f-sls").text(info.total_sales)
    $("#f-exp").text(info.total_expenses)
    $("#f-prf").text(info.total_profit)
    $("#f-dbt").text(info.total_debts)
    $("#f-coh").text(info.total_coh)
    
    var lbl = []
    var sls = []
    var time_data = data.individual_sales
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
                label: "sales",
                backgroundColor: '#3f51b5',
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



var colors = [
'#f44336', '#e91e63', '#9c27b0', '#673ab7', 
'#3f51b5', '#2196f3', '#03a9f4', '#00bcd4',
'#009688', '#4caf50', '#8bc34a', '#cddc39',
'#ffeb3b', '#ffc107', '#ff9800', '#ff5722',
'#ff1744', '#f50057', '#d500f9', '#651fff',
'#3d5afe', '#2979ff', '#00b0ff', '#00e5ff',
'#1de9b6', '#00e676', '#76ff03', '#c6ff00',
'#ffea00', '#ffc400', '#ff9100', '#ff3d00' ]

function buildDoughnut(){
    var sales = inventory_sales.product_sales
    var lbl = []
    var sls = []
    var bg = []
    var total = 0
    for(i in sales){
        item = sales[i]
        var name = item["name"]
        var sold_quantity = item["sold_quantity"]
        var sold_heads = item["sold_heads"]
        var sold_price = item["sold_price"]
        var s = parseFloat(sold_price)
        total+=s
      
        sls.push(s)
        lbl.push(name)
        bg.push(colors[i])
    }
    var config = {
        type: 'doughnut',
        data: {
            datasets: [{
                data: sls,
                backgroundColor: bg,
                label: 'Sales'
            }],
            labels: lbl
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
    var ctx = document.getElementById('doughnut').getContext('2d');
    window.myDoughnut = new Chart(ctx, config);
    ctx.height = 600;
    total = parseFloat(total.toFixed(2)).toLocaleString('en')
    $("#doughnut-chart-label div:first-child").html("₱"+total)
}



window.onload = function() {
    Chart.defaults.global.legend.labels.usePointStyle = true;
   
    
};





