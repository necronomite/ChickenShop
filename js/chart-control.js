var ctx1 = document.getElementById('line').getContext('2d');
var chart = new Chart(ctx1, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset

    data: {
        labels: [...Array(32).keys()],
        datasets: [{
            fill: "false",
            label: "My First dataset",
            backgroundColor: 'transparent',
            pointBorderColor: 'transparent',
            borderColor: 'rgb(86, 131, 255)',
            data: [1,2,3,4,5,6,7,8,19,10,111,122,133,144,155,180,217,318,219,220,190,170,150,124,25,26,127,28,29,130,31,11],
        }]
    },

    // Configuration options go here
    options: {
        maintainAspectRatio: false,
        legend: {
            display: false,
            labels: {
                display: false
            }
        }

    }
});
ctx1.height = 600;





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
    var ctx = document.getElementById('doughnut').getContext('2d');
    window.myDoughnut = new Chart(ctx, config);
    ctx.height = 600;

    $('.dropdown-trigger').dropdown()
    
};





