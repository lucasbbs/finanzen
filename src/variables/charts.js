/*!

=========================================================
* Black Dashboard PRO React - v1.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-pro-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

const { currencyFormat } = require('helpers/functions');

// ##############################
// // // Chart variables
// #############################

// chartExample1 and chartExample2 options

// function format(label) {
//   let formatCurrency = new Intl.NumberFormat('pt-BR', {
//     style: 'currency',
//     currency: 'BRL',
//     minimumFractionDigits: 2,
//   });
//   return formatCurrency.format(Number(label));
// }
let chart_1_2_3_options = {
  maintainAspectRatio: false,
  legend: {
    display: false,
  },
  tooltips: {
    backgroundColor: '#f5f5f5',
    titleFontColor: '#333',
    bodyFontColor: '#666',
    bodySpacing: 4,
    xPadding: 12,
    mode: 'nearest',
    intersect: 0,
    position: 'nearest',
  },
  responsive: true,
  scales: {
    yAxes: [
      {
        barPercentage: 1.6,
        gridLines: {
          drawBorder: false,
          color: 'rgba(29,140,248,0.0)',
          zeroLineColor: 'transparent',
        },
        ticks: {
          suggestedMin: 60,
          suggestedMax: 125,
          padding: 20,
          fontColor: '#9a9a9a',
        },
      },
    ],
    xAxes: [
      {
        barPercentage: 1.6,
        gridLines: {
          drawBorder: false,
          color: 'rgba(29,140,248,0.1)',
          zeroLineColor: 'transparent',
        },
        ticks: {
          padding: 20,
          fontColor: '#9a9a9a',
        },
      },
    ],
  },
};

// #########################################
// // // used inside src/views/Dashboard.js
// #########################################
let chartExample1 = {
  data1: (canvas) => {
    let ctx = canvas.getContext('2d');

    let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

    gradientStroke.addColorStop(1, 'rgba(29,140,248,0.2)');
    gradientStroke.addColorStop(0.4, 'rgba(29,140,248,0.0)');
    gradientStroke.addColorStop(0, 'rgba(29,140,248,0)'); //blue colors

    return {
      labels: [
        'JAN',
        'FEB',
        'MAR',
        'APR',
        'MAY',
        'JUN',
        'JUL',
        'AUG',
        'SEP',
        'OCT',
        'NOV',
        'DEC',
      ],
      datasets: [
        {
          label: 'My First dataset',
          fill: true,
          backgroundColor: gradientStroke,
          borderColor: '#1f8ef1',
          borderWidth: 2,
          borderDash: [],
          borderDashOffset: 0.0,
          pointBackgroundColor: '#1f8ef1',
          pointBorderColor: 'rgba(255,255,255,0)',
          pointHoverBackgroundColor: '#1f8ef1',
          pointBorderWidth: 20,
          pointHoverRadius: 4,
          pointHoverBorderWidth: 15,
          pointRadius: 4,
          data: [100, 70, 90, 70, 85, 60, 75, 60, 90, 80, 110, 100],
        },
      ],
    };
  },
  data2: (canvas) => {
    let ctx = canvas.getContext('2d');

    let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

    gradientStroke.addColorStop(1, 'rgba(29,140,248,0.2)');
    gradientStroke.addColorStop(0.4, 'rgba(29,140,248,0.0)');
    gradientStroke.addColorStop(0, 'rgba(29,140,248,0)'); //blue colors

    return {
      labels: [
        'JAN',
        'FEB',
        'MAR',
        'APR',
        'MAY',
        'JUN',
        'JUL',
        'AUG',
        'SEP',
        'OCT',
        'NOV',
        'DEC',
      ],
      datasets: [
        {
          label: 'My First dataset',
          fill: true,
          backgroundColor: gradientStroke,
          borderColor: '#1f8ef1',
          borderWidth: 2,
          borderDash: [],
          borderDashOffset: 0.0,
          pointBackgroundColor: '#1f8ef1',
          pointBorderColor: 'rgba(255,255,255,0)',
          pointHoverBackgroundColor: '#1f8ef1',
          pointBorderWidth: 20,
          pointHoverRadius: 4,
          pointHoverBorderWidth: 15,
          pointRadius: 4,
          data: [80, 120, 105, 110, 95, 105, 90, 100, 80, 95, 70, 120],
        },
      ],
    };
  },
  data3: (canvas) => {
    let ctx = canvas.getContext('2d');

    let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

    gradientStroke.addColorStop(1, 'rgba(29,140,248,0.2)');
    gradientStroke.addColorStop(0.4, 'rgba(29,140,248,0.0)');
    gradientStroke.addColorStop(0, 'rgba(29,140,248,0)'); //blue colors

    return {
      labels: [
        'JAN',
        'FEB',
        'MAR',
        'APR',
        'MAY',
        'JUN',
        'JUL',
        'AUG',
        'SEP',
        'OCT',
        'NOV',
        'DEC',
      ],
      datasets: [
        {
          label: 'My First dataset',
          fill: true,
          backgroundColor: gradientStroke,
          borderColor: '#1f8ef1',
          borderWidth: 2,
          borderDash: [],
          borderDashOffset: 0.0,
          pointBackgroundColor: '#1f8ef1',
          pointBorderColor: 'rgba(255,255,255,0)',
          pointHoverBackgroundColor: '#1f8ef1',
          pointBorderWidth: 20,
          pointHoverRadius: 4,
          pointHoverBorderWidth: 15,
          pointRadius: 4,
          data: [60, 80, 65, 130, 80, 105, 90, 130, 70, 115, 60, 130],
        },
      ],
    };
  },
  options: chart_1_2_3_options,
};

let chartExample2 = {
  data: (data) => ({
    labels: data[0],
    datasets: data[1],
  }),
  options: (currency) => ({
    maintainAspectRatio: false,
    legend: {
      display: true,
      position: 'bottom',
      labels: {
        padding: 8,
        boxWidth: 11,
        boxHeight: 14,
        fontColor: 'white',
        fontSize: 11.5,
      },
    },
    tooltips: {
      backgroundColor: '#f5f5f5',
      titleFontColor: '#333',
      bodyFontColor: '#666',
      bodySpacing: 4,
      mode: 'nearest',
      intersect: 0,
      position: 'nearest',
      callbacks: {
        label: function (tooltipItem, data) {
          var indice = tooltipItem.index;
          var label = data.datasets[tooltipItem.datasetIndex].label + ': ';

          return `${label}:  ${currencyFormat(
            data.datasets[tooltipItem.datasetIndex].data[indice],
            currency
          )}`;
        },
      },
    },
    responsive: true,
    scales: {
      yAxes: [
        {
          gridLines: {
            drawBorder: false,
            color: 'white',
            zeroLineColor: 'white',
          },
          ticks: {
            maxTicksLimit: 4,
            padding: 20,
            fontColor: 'white',
          },
        },
      ],
      xAxes: [
        {
          gridLines: {
            drawBorder: false,
            color: 'transparent',
            zeroLineColor: 'white',
          },
          ticks: {
            padding: 20,
            fontColor: 'white',
          },
        },
      ],
    },
  }),
};

// #########################################
// // // used inside src/views/Dashboard.js
// #########################################
let chartExample3 = {
  data: (canvas) => {
    let ctx = canvas.getContext('2d');

    let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

    gradientStroke.addColorStop(1, 'rgba(72,72,176,0.1)');
    gradientStroke.addColorStop(0.4, 'rgba(72,72,176,0.0)');
    gradientStroke.addColorStop(0, 'rgba(119,52,169,0)'); //purple colors

    return {
      labels: ['USA', 'GER', 'AUS', 'UK', 'RO', 'BR'],
      datasets: [
        {
          label: 'Countries',
          fill: true,
          backgroundColor: gradientStroke,
          hoverBackgroundColor: gradientStroke,
          borderColor: '#d048b6',
          borderWidth: 2,
          borderDash: [],
          borderDashOffset: 0.0,
          data: [53, 20, 10, 80, 100, 45],
        },
      ],
    };
  },
  options: {
    maintainAspectRatio: false,
    legend: {
      display: false,
    },
    tooltips: {
      backgroundColor: '#f5f5f5',
      titleFontColor: '#333',
      bodyFontColor: '#666',
      bodySpacing: 4,
      xPadding: 12,
      mode: 'nearest',
      intersect: 0,
      position: 'nearest',
    },
    responsive: true,
    scales: {
      yAxes: [
        {
          gridLines: {
            drawBorder: false,
            color: 'rgba(225,78,202,0.1)',
            zeroLineColor: 'transparent',
          },
          ticks: {
            suggestedMin: 60,
            suggestedMax: 120,
            padding: 20,
            fontColor: '#9e9e9e',
          },
        },
      ],
      xAxes: [
        {
          gridLines: {
            drawBorder: false,
            color: 'rgba(225,78,202,0.1)',
            zeroLineColor: 'transparent',
          },
          ticks: {
            padding: 20,
            fontColor: '#9e9e9e',
          },
        },
      ],
    },
  },
};

// #########################################
// // // used inside src/views/Dashboard.js
// #########################################
const chartExample4 = {
  data: (canvas) => {
    let ctx = canvas.getContext('2d');

    let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

    gradientStroke.addColorStop(1, 'rgba(66,134,121,0.15)');
    gradientStroke.addColorStop(0.4, 'rgba(66,134,121,0.0)'); //green colors
    gradientStroke.addColorStop(0, 'rgba(66,134,121,0)'); //green colors

    return {
      labels: ['JUL', 'AUG', 'SEP', 'OCT', 'NOV'],
      datasets: [
        {
          label: 'My First dataset',
          fill: true,
          backgroundColor: gradientStroke,
          borderColor: '#00d6b4',
          borderWidth: 2,
          borderDash: [],
          borderDashOffset: 0.0,
          pointBackgroundColor: '#00d6b4',
          pointBorderColor: 'rgba(255,255,255,0)',
          pointHoverBackgroundColor: '#00d6b4',
          pointBorderWidth: 20,
          pointHoverRadius: 4,
          pointHoverBorderWidth: 15,
          pointRadius: 4,
          data: [90, 27, 60, 12, 80],
        },
      ],
    };
  },
  options: {
    maintainAspectRatio: false,
    legend: {
      display: false,
    },
    tooltips: {
      backgroundColor: '#f5f5f5',
      titleFontColor: '#333',
      bodyFontColor: '#666',
      bodySpacing: 4,
      xPadding: 12,
      mode: 'nearest',
      intersect: 0,
      position: 'nearest',
    },
    responsive: true,
    scales: {
      yAxes: [
        {
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: 'rgba(29,140,248,0.0)',
            zeroLineColor: 'transparent',
          },
          ticks: {
            suggestedMin: 50,
            suggestedMax: 125,
            padding: 20,
            fontColor: '#9e9e9e',
          },
        },
      ],
      xAxes: [
        {
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: 'rgba(0,242,195,0.1)',
            zeroLineColor: 'transparent',
          },
          ticks: {
            padding: 20,
            fontColor: '#9e9e9e',
          },
        },
      ],
    },
  },
};

// #########################################
// // // used inside src/views/Charts.js
// #########################################
const chartExample5 = {
  data: (canvas) => {
    let ctx = canvas.getContext('2d');
    var gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

    gradientStroke.addColorStop(1, 'rgba(72,72,176,0.4)');
    gradientStroke.addColorStop(0.8, 'rgba(72,72,176,0.2)');
    gradientStroke.addColorStop(0, 'rgba(119,52,169,0)'); //purple colors
    return {
      labels: ['JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
      datasets: [
        {
          label: 'Data',
          fill: true,
          backgroundColor: gradientStroke,
          borderColor: '#ba54f5',
          borderWidth: 2,
          borderDash: [],
          borderDashOffset: 0.0,
          pointBackgroundColor: '#be55ed',
          pointBorderColor: 'rgba(255,255,255,0)',
          pointHoverBackgroundColor: '#be55ed',
          //pointHoverBorderColor:'rgba(35,46,55,1)',
          pointBorderWidth: 20,
          pointHoverRadius: 4,
          pointHoverBorderWidth: 15,
          pointRadius: 4,
          data: [80, 100, 70, 80, 120, 80],
        },
      ],
    };
  },
  options: {
    maintainAspectRatio: false,
    legend: {
      display: false,
    },
    tooltips: {
      backgroundColor: '#f5f5f5',
      titleFontColor: '#333',
      bodyFontColor: '#666',
      bodySpacing: 4,
      xPadding: 12,
      mode: 'nearest',
      intersect: 0,
      position: 'nearest',
    },
    responsive: true,
    scales: {
      yAxes: [
        {
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: 'rgba(186,84,245,0.1)',
            zeroLineColor: 'transparent',
          },
          ticks: {
            suggestedMin: 60,
            suggestedMax: 125,
            padding: 20,
            fontColor: '#9e9e9e',
          },
        },
      ],
      xAxes: [
        {
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: 'rgba(186,84,245,0.1)',
            zeroLineColor: 'transparent',
          },
          ticks: {
            padding: 20,
            fontColor: '#9e9e9e',
          },
        },
      ],
    },
  },
};
// #########################################
// // // used inside src/views/Charts.js
// #########################################
const chartExample6 = {
  data: (canvas) => {
    let ctx = canvas.getContext('2d');
    var gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

    gradientStroke.addColorStop(1, 'rgba(0,135,191,0.2)');
    gradientStroke.addColorStop(0.8, 'rgba(0,135,191,0.1)');
    gradientStroke.addColorStop(0, 'rgba(0,84,119,0)'); //blue colors
    return {
      labels: ['JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
      datasets: [
        {
          label: 'Data',
          fill: true,
          backgroundColor: gradientStroke,
          borderColor: '#2380f7',
          borderWidth: 2,
          borderDash: [],
          borderDashOffset: 0.0,
          pointBackgroundColor: '#2380f7',
          pointBorderColor: 'rgba(255,255,255,0)',
          pointHoverBackgroundColor: '#2380f7',
          pointBorderWidth: 20,
          pointHoverRadius: 4,
          pointHoverBorderWidth: 15,
          pointRadius: 4,
          data: [80, 100, 70, 80, 120, 80],
        },
      ],
    };
  },
  options: {
    maintainAspectRatio: false,
    legend: {
      display: false,
    },
    tooltips: {
      backgroundColor: '#f5f5f5',
      titleFontColor: '#333',
      bodyFontColor: '#666',
      bodySpacing: 4,
      xPadding: 12,
      mode: 'nearest',
      intersect: 0,
      position: 'nearest',
    },
    responsive: true,
    scales: {
      yAxes: [
        {
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: 'rgba(29,140,248,0.0)',
            zeroLineColor: 'transparent',
          },
          ticks: {
            suggestedMin: 60,
            suggestedMax: 125,
            padding: 20,
            fontColor: '#9e9e9e',
          },
        },
      ],
      xAxes: [
        {
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: 'rgba(29,140,248,0.1)',
            zeroLineColor: 'transparent',
          },
          ticks: {
            padding: 20,
            fontColor: '#9e9e9e',
          },
        },
      ],
    },
  },
};
// #########################################
// // // used inside src/views/Charts.js
// #########################################
const chartExample7 = {
  data: (canvas) => {
    let ctx = canvas.getContext('2d');
    var gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

    gradientStroke.addColorStop(1, 'rgba(253,93,147,0.8)');
    gradientStroke.addColorStop(0, 'rgba(253,93,147,0)'); //blue colors
    return {
      labels: ['JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
      datasets: [
        {
          label: 'Data',
          fill: true,
          backgroundColor: gradientStroke,
          hoverBackgroundColor: gradientStroke,
          borderColor: '#ff5991',
          borderWidth: 2,
          borderDash: [],
          borderDashOffset: 0.0,
          data: [80, 100, 70, 80, 120, 80],
        },
      ],
    };
  },
  options: {
    maintainAspectRatio: false,
    legend: {
      display: false,
    },
    tooltips: {
      backgroundColor: '#f5f5f5',
      titleFontColor: '#333',
      bodyFontColor: '#666',
      bodySpacing: 4,
      xPadding: 12,
      mode: 'nearest',
      intersect: 0,
      position: 'nearest',
    },
    responsive: true,
    scales: {
      yAxes: [
        {
          gridLines: {
            drawBorder: false,
            color: 'rgba(253,93,147,0.1)',
            zeroLineColor: 'transparent',
          },
          ticks: {
            suggestedMin: 60,
            suggestedMax: 125,
            padding: 20,
            fontColor: '#9e9e9e',
          },
        },
      ],
      xAxes: [
        {
          gridLines: {
            drawBorder: false,
            color: 'rgba(253,93,147,0.1)',
            zeroLineColor: 'transparent',
          },
          ticks: {
            padding: 20,
            fontColor: '#9e9e9e',
          },
        },
      ],
    },
  },
};
// #########################################
// // // used inside src/views/Charts.js
// #########################################
const chartExample8 = {
  data: {
    labels: ['JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
    datasets: [
      {
        label: 'Expenses',
        fill: true,
        backgroundColor: 'rgb(0, 130, 200)',
        hoverBackgroundColor: ' rgb(0, 130, 200)',
        borderColor: 'rgb(0, 130, 200)',
        borderWidth: 2,
        borderDash: [],
        borderDashOffset: 0.0,
        data: [80, 100, 70, 80, 120, 80, 130],
      },
      {
        label: 'Revenue',
        fill: true,
        backgroundColor: 'rgb(166, 204, 234)',
        hoverBackgroundColor: 'rgb(166, 204, 234)',
        borderColor: 'rgb(166, 204, 234)',
        borderWidth: 2,
        borderDash: [],
        borderDashOffset: 0.0,
        data: [60, 110, 90, 70, 90, 100],
      },
      {
        label: 'Balance',
        fill: true,
        backgroundColor: 'rgb(204, 20, 57)',
        hoverBackgroundColor: '  rgb(204, 20, 57)',
        borderColor: 'rgb(204, 20, 57)',
        borderWidth: 2,
        borderDash: [],
        borderDashOffset: 0.0,
        data: [-20, 10, 20, -10, 10, -30],
      },
    ],
  },
  options: {
    maintainAspectRatio: false,
    legend: {
      display: true,
      position: 'bottom',
      labels: {
        padding: 8,
        boxWidth: 11,
        boxHeight: 14,
        fontColor: 'white',
        fontSize: 11.5,
      },
    },
    tooltips: {
      backgroundColor: '#f5f5f5',
      titleFontColor: '#333',
      bodyFontColor: '#666',
      bodySpacing: 4,
      xPadding: 12,
      mode: 'nearest',
      intersect: 0,
      position: 'nearest',
    },
    responsive: true,
    scales: {
      yAxes: [
        {
          gridLines: {
            drawBorder: true,
            color: 'white',
            zeroLineColor: 'white',
          },
          ticks: {
            maxTicksLimit: 5,
            padding: 20,
            fontColor: 'white',
          },
        },
      ],
      xAxes: [
        {
          gridLines: {
            drawBorder: false,
          },
          ticks: {
            padding: 20,
            fontColor: 'white',
          },
        },
      ],
    },
  },
};
// #########################################
// // // used inside src/views/Charts.js
// #########################################
const chartExample9 = {
  data: {
    labels: [1, 2],
    datasets: [
      {
        label: 'Emails',
        pointRadius: 0,
        pointHoverRadius: 0,
        backgroundColor: ['#00c09d', '#e2e2e2'],
        borderWidth: 0,
        data: [60, 40],
      },
    ],
  },
  options: {
    cutoutPercentage: 70,
    legend: {
      display: false,
    },

    tooltips: {
      backgroundColor: '#f5f5f5',
      titleFontColor: '#333',
      bodyFontColor: '#666',
      bodySpacing: 4,
      xPadding: 12,
      mode: 'nearest',
      intersect: 0,
      position: 'nearest',
    },

    scales: {
      yAxes: [
        {
          display: 0,
          ticks: {
            display: true,
          },
          gridLines: {
            drawBorder: false,
            zeroLineColor: 'white',
            color: 'white',
          },
        },
      ],

      xAxes: [
        {
          display: 0,
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: 'white',
            zeroLineColor: 'white',
          },
          ticks: {
            display: true,
          },
        },
      ],
    },
  },
};
// #########################################
// // // used inside src/views/Charts.js
// #########################################
const chartExample10 = {
  data: {
    labels: [
      'Aluguel',
      'Alimentação',
      'Internet',
      'Telefone',
      'Energia Elétrica',
      'Cartão de Crédito',
      // 'Educação',
      // 'Gastos com Pets',
      // 'Água e Saneamento',
      // 'Cabelo',
    ],
    datasets: [
      {
        label: 'Emails',
        pointRadius: 0,
        pointHoverRadius: 0,
        backgroundColor: [
          'rgb(0, 130, 200)',
          'rgb(191, 229, 255)',
          'rgb(204, 20, 57)',
          'rgb(230, 140, 124)',
          'rgb(83, 179, 54)',
          'rgb(165, 211, 142)',
          'rgb(230, 138, 0)',
          'rgb(243, 218, 97)',
          'rgb(151, 107, 179)',
          'rgb(204, 184, 204)',
        ],

        borderWidth: 0,
        data: [
          60,
          40,
          20,
          40,
          50,
          20,
          //  10, 5, 4, 8
        ],
      },
    ],
  },
  options: {
    cutoutPercentage: 0,
    legend: {
      display: true,

      position: 'bottom',
      labels: {
        padding: 8,
        boxWidth: 11,
        boxHeight: 14,
        fontColor: 'white',
        fontSize: 11.5,
      },
    },
    tooltips: {
      backgroundColor: '#f5f5f5',
      titleFontColor: '#333',
      bodyFontColor: '#666',
      bodySpacing: 4,
      xPadding: 12,
      mode: 'nearest',
      intersect: 0,
      position: 'nearest',
    },
    scales: {
      yAxes: [
        {
          display: 0,
          ticks: {
            display: false,
          },
          gridLines: {
            drawBorder: false,
            zeroLineColor: 'transparent',
            color: 'rgba(255,255,255,0.05)',
          },
        },
      ],
      xAxes: [
        {
          display: 0,
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: 'rgba(255,255,255,0.1)',
            zeroLineColor: 'transparent',
          },
          ticks: {
            display: false,
          },
        },
      ],
    },
  },
};
const chartDefault = (dataList, labels, currency) => {
  let gradientStroke = {};
  const data = (canvas) => {
    let ctx = canvas.getContext('2d');
    gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

    gradientStroke.addColorStop(1, 'rgba(72,72,176,0.1)');
    gradientStroke.addColorStop(0.4, 'rgba(72,72,176,0.0)');
    gradientStroke.addColorStop(0, 'rgba(119,52,169,0)'); //purple colors

    return gradientStroke;
  };

  const options = {
    maintainAspectRatio: false,
    legend: {
      display: false,
    },
    tooltips: {
      backgroundColor: '#f5f5f5',
      titleFontColor: '#333',
      bodyFontColor: '#666',
      bodySpacing: 4,
      xPadding: 12,
      mode: 'nearest',
      intersect: 0,
      position: 'nearest',
      locale: 'pt-BR',
      callbacks: {
        label: function (tooltipItem, data) {
          var indice = tooltipItem.index;
          return `${data.labels[indice]}:  ${currencyFormat(
            data.datasets[0].data[indice],
            currency
          )}`;
        },
      },
    },
    responsive: true,
    scales: {
      yAxes: [
        {
          gridLines: {
            display: false,
            drawBorder: false,
            color: 'rgba(225,78,202,0.1)',
            zeroLineColor: 'transparent',
          },
          ticks: {
            display: false,
            suggestedMin: 60,
            suggestedMax: 120,
            padding: 20,
            fontColor: '#9e9e9e',
          },
        },
      ],
      xAxes: [
        {
          gridLines: {
            display: false,
            drawBorder: false,
            color: 'rgba(225,78,202,0.1)',
            zeroLineColor: 'transparent',
          },
          ticks: {
            display: false,
            padding: 20,
            fontColor: '#9e9e9e',
          },
        },
      ],
    },
  };
  return {
    gradientStroke,
    labels: labels,
    datasets: [
      {
        label: 'Countries',
        fill: true,
        backgroundColor: 'transparent',
        hoverBackgroundColor: 'rgba(208, 72, 182, 0.15)',
        borderColor: 'rgba(208, 72, 182)',
        borderWidth: 2,
        borderDash: [],
        borderDashOffset: 0.0,
        data: dataList,
      },
    ],
    options: options,
    data: data,
  };
};

module.exports = {
  chartDefault,
  chartExample1, // in src/views/Dashboard.js
  chartExample2, // in src/views/Dashboard.js
  chartExample3, // in src/views/Dashboard.js
  chartExample4, // in src/views/Dashboard.js
  chartExample5, // in src/views/Charts.js
  chartExample6, // in src/views/Charts.js
  chartExample7, // in src/views/Charts.js
  chartExample8, // in src/views/Charts.js
  chartExample9, // in src/views/Charts.js
  chartExample10, // in src/views/Charts.js
};
