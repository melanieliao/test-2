// Load data from stock_data.js (already available as `stockData` and `stockList`)

// Populate Dropdowns
let stockSelect = document.getElementById("stockSelect");
let yearSelect = document.getElementById("yearSelect");
let chartSelect = document.getElementById("chartSelect");

stockList.stocks.forEach(stock => {
    let option = document.createElement("option");
    option.value = stock;
    option.text = stock;
    stockSelect.appendChild(option);
});

stockList.years.forEach(year => {
    let option = document.createElement("option");
    option.value = year;
    option.text = year;
    yearSelect.appendChild(option);
});

// Event Listener for "Show Graph" Button
document.getElementById("showGraphButton").addEventListener("click", updateGraph);

function updateGraph() {
    let stock = stockSelect.value;
    let year = parseInt(yearSelect.value, 10);
    let chartType = chartSelect.value;

    if (!stock || !year) {
        alert("Please select a stock and year!");
        return;
    }

    let dataPoints = stockData[stock]?.[year];
    if (!dataPoints || dataPoints.length === 0) {
        alert(`No data available for ${stock} in ${year}`);
        return;
    }

    if (chartType === "linear_regression") {
        plotLinearRegressionChart(dataPoints);
    } else if (chartType === "candlestick") {
        plotCandlestickChart(dataPoints);
    } else {
        alert("Invalid chart type selected.");
    }
}

function plotLinearRegressionChart(data) {
    let dates = data.map(d => new Date(d.Date));
    let prices = data.map(d => d.Close);
    let xValues = Array.from({length: prices.length}, (_, i) => i);

    let sumX = xValues.reduce((a, b) => a + b, 0);
    let sumY = prices.reduce((a, b) => a + b, 0);
    let sumXY = xValues.map((x, i) => x * prices[i]).reduce((a, b) => a + b, 0);
    let sumXX = xValues.map(x => x * x).reduce((a, b) => a + b, 0);
    let n = xValues.length;

    let slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    let intercept = (sumY - slope * sumX) / n;
    let regressionLine = xValues.map(x => slope * x + intercept);

    let trace1 = {
        x: dates,
        y: prices,
        mode: 'markers',
        name: 'Stock Prices',
        marker: { color: 'blue' }
    };

    let trace2 = {
        x: dates,
        y: regressionLine,
        mode: 'lines',
        name: 'Linear Regression',
        line: { color: 'red' }
    };

    Plotly.newPlot("plot", [trace1, trace2], { title: "Linear Regression Chart" });
}

function plotCandlestickChart(data) {
    let trace = {
        x: data.map(d => d.Date),
        open: data.map(d => d.Open),
        high: data.map(d => d.High),
        low: data.map(d => d.Low),
        close: data.map(d => d.Close),
        type: 'candlestick'
    };
    Plotly.newPlot("plot", [trace], { title: "Candlestick Chart" });
}