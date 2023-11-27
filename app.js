const firstBox = document.getElementById('firstbox'); // need to see if this is still necessary
const firstnameIndex = 2;
let timeData = [];
let gridData = [];
let dailyAverageGrid = [];
const minInDay = 96;
const dayInMonth = [-1, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
//have index start at one essentially

function getDailyAverages(dataArray) {
    let holdingArray = [];
    let daySum = 0;
    let j = 0;
    for (let i = 0; i < dataArray.length; ++ i) {
        daySum += parseFloat(dataArray[i]);
        ++j;
        if (j == minInDay) {
            j = 0;
            daySum /= minInDay;
            holdingArray.push(daySum);
            daySum = 0;
            
        }
    }
    return holdingArray;
}

function getDailyPeaks(dataArray) {
    let holdingArray = [];
    let dayMax = 0;
    let j = 0;
    for (let i = 0; i < dataArray.length; ++ i) {
        dayMax = max(parseFloat(dataArray[i]), dayMax);
        ++j;
        if (j == minInDay) {
            j = 0;
            holdingArray.push(dayMax);
            dayMax = 0;
            
        }
    }
    return holdingArray;
}

function getWeeklyAverages(dataArray) {
    let holdingArray = [];
    let weekSum = 0;
    let j = 0;
    for (let i = 0; i < dataArray.length; ++ i) {
        weekSum += parseFloat(dataArray[i]);
        ++j;
        if (j == 7) {
            j = 0;
            weekSum /= 7;
            holdingArray.push(weekSum);
            weekSum = 0;
            
        }
    }
    return holdingArray;
}

function getWeeklyPeaks(dataArray) {
    let holdingArray = [];
    let weekMax = 0;
    let j = 0;
    for (let i = 0; i < dataArray.length; ++ i) {
        weekMax = max(parseFloat(dataArray[i]), weekMax);
        ++j;
        if (j == 7) {
            j = 0;
            holdingArray.push(weekMax);
            weekMax = 0;
            
        }
    }
    return holdingArray;
}

function getMonthlyAverages(dataArray) {
    let holdingArray = [];
    let monthSum = 0;
    let j = 0;
    let k = 0;
    for (let i = 0; i < dataArray.length; ++ i) {
        monthSum += parseFloat(dataArray[i]);
        ++j;
        if (j == dayInMonth[k]) {
            j = 0;
            monthSum /= dayInMonth[k];
            holdingArray.push(monthSum);
            monthSum = 0;
            k++;
            
        }
    }
    return holdingArray;
}

function getMonthlyPeaks(dataArray) {
    let holdingArray = [];
    let monthSum = 0;
    let j = 0;
    let k = 0;
    for (let i = 0; i < dataArray.length; ++ i) {
        monthSum += parseFloat(dataArray[i]);
        ++j;
        if (j == dayInMonth[k]) {
            j = 0;
            monthSum /= dayInMonth[k];
            holdingArray.push(monthSum);
            monthSum = 0;
            k++;
            
        }
    }
    return holdingArray;
}

function getYearlyAverage() {}

function getYearlyPeak() {}

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
            timeData.push(Object.values(data[i])[1]);
            gridData.push(Object.values(data[i])[7]);
        }
        dailyAverageGrid = getDailyAverages(gridData);
    })
    .then(itemOfInterest => {
        bottom = document.getElementById('testContainer')
        //createNewCanvas('chart1', bottom)
        createNewChart('chart1', timeData, dailyAverageGrid)})
    
