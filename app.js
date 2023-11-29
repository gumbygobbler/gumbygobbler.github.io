const firstBox = document.getElementById('firstbox'); // need to see if this is still necessary
const firstnameIndex = 2;
let timeData = Array.from({length: 365}, (_, index) = index + 1);
let gridData = [];
let dailyAverageGrid = [];

function createNewCanvas(name, bottom) {
    newChart = document.createElement("canvas");
    newChart.id = name;
    bottom.appendChild(newChart);
}

function createNewChart(chartName, timeData, powerData) { 
    chart = new Chart(document.getElementById('chart1'), {
        type: "line",
        data: {
            labels: Array.from(Array(365).keys()),
            datasets: [
                {
                label: "kwatt/h",
                data: powerData,
                backgroundColor:"rgb(44, 141, 206)"
                }
            ]
        }
    })
    // bottom = document.getElementById('testChart')
    // bottom.appendChild(newChart);
    console.log("attempted to create chart")
}

fetch('http://localhost:8000/')
    .then(response => response.json())
    .then(data => {
        console.log(data)
        firstName = Object.values(data[0])[firstnameIndex];
        firstBox.innerHTML = firstName;
    })
    .catch(err => console.log(err))

fetch('http://localhost:8000/data')
    .then(response => response.json())
    .then(data => {
        console.log("data read")
        for (let i = 1; i < data.length; ++i) {
            gridData.push(Object.values(data[i])[7]);
        }
    })
    .then(itemOfInterest => {
        bottom = document.getElementById('testContainer')
        //createNewCanvas('chart1', bottom)
        createNewChart('chart1', timeData, dailyAverageGrid)})
    
