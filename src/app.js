
const firstBox = document.getElementById('firstbox'); // need to see if this is still necessary
const firstnameIndex = 2;
//let timeData = Array.from(Array(365).keys());
 //figure out a better way to do this
let applianceType = []; //NOTICE: final two "appliances are supposed to just be voltage of wall outlet"
let dataPackages = [];
let times = [];
let dates = [];
let username = "";

function createNewChart(index, bottom, timeData, powerData, appliance, dataType) {
    newChart = document.createElement("canvas");
    bottomElement = document.getElementById(bottom);
    let name = "chart" + index;
    newChart.id = name;
    console.log(name);
    
    bottomElement.appendChild(newChart);

    const data = {
        labels: timeData,
        datasets: [{
            label: dataType + ' of ' + appliance + ' in kwatt/h',
            fill: {
                target: 'origin',   
                below: 'rgb(0, 0, 255)' 
            },   // And blue below the origin
            backgroundColor:"rgb(44, 141, 206)",
            borderColor: "rgba(0,0,255,0.1)",
            data: powerData
        }]    
    }
    const config = {
        type: "line",
        data,
        options: {
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: "white",
                        font: {
                            size: 20
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: "white"
                    }
                },
                x: {
                    ticks: {
                        maxTicksLimit: 24,
                        color: "white"
                    }
                }
            },
            elements: {
                line: {

                },
                point: {
                    pointRadius: 2
                }
            }
        }   
    }

    chart = new Chart(name, config);

    newSelect = document.createElement("select");
    var choices = ["past 24h", "daily averages", "daily peaks", "weekly averages", "weekly peaks", "monthly averages", "monthly peaks"];

    //Create and append select list
    var selectList = document.createElement("select");
    selectList.id = "select" + index;
    selectList.className = "chartSelector";
    selectList.onchange = "";
    bottomElement.appendChild(selectList);
    console.log("just appended " + selectList.id);

    //Create and append the options
    for (var i = 0; i < choices.length; i++) {
        var option = document.createElement("option");
        option.value = choices[i];
        option.text = choices[i];
        selectList.appendChild(option);
    }

    return chart;
}

//change the chart values based on user input
function changeChartValues(givenChart, index, dates, times, dataPackages, appliance) {
    chart = givenChart;
    desiredValues = document.getElementById("select" + index).value;
    let choices = ["past 24h", "daily averages", "daily peaks", "weekly averages", "weekly peaks", "monthly averages", "monthly peaks"];
    //determine what type of data to use
    choiceIndex = choices.indexOf(desiredValues);
    desiredData = dataPackages[index][choiceIndex];
    weeklyDates = [];
    monthlyDates = [];
    
    //make weekly labels
    for(let i = 0; i < dates.length; i += 7) {
        weeklyDates.push(dates[i]);
    }
    
    //make monthly labels
    monthlyDates = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "June", "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."]
    
    
    //clear chart data and put in new data
    chart.data.datasets.forEach((dataset) => {
        dataset.label = desiredValues + ' of ' + appliance + ' in kwatt/h';
        dataset.data = desiredData;
    });
    
    
    //set for time
    if (desiredValues == choices[0]) {
        chart.data.labels = times;
        chart.options.scales.x.ticks.maxTicksLimit = 24;
        chart.update();
        console.log("entered for time correctly");
    }
    //set for dates
    else if (desiredValues == choices[1] || desiredValues == choices[2]) {
        chart.data.labels = dates.slice(dates.length - 31);
        chart.options.scales.x.ticks.maxTicksLimit = 31;
        chart.update();
        console.log("entered for days correctly");
    }
    else if (desiredValues == choices[3] || desiredValues == choices[4]) {
        chart.data.labels = weeklyDates.slice(weeklyDates.length - 26);
        chart.options.scales.x.ticks.maxTicksLimit = 26;
        chart.update();
        console.log("entered for weeks correctly");
    }
    else if (desiredValues == choices[5] || desiredValues == choices[6]) {
        chart.data.labels = (monthlyDates);
        chart.options.scales.x.ticks.maxTicksLimit = 12;
        chart.update();
        console.log("entered for months correctly");
    }
    console.log("supposed to be in here")
}

function readableName(dataName) { //weird issues with how theyre named in mongodb
    dataNames = ['air', 'air2', 'air3', 'airwindowunit1', 'aquarium1', 'bathroom1', 'bathroom2',
                    'bedroom1', 'bedroom2', 'bedroom3', 'bedroom4', 'bedroom5', 'battery1', 'car1', 'car2', 'circpump1', 
                    'clotheswasher1', 'clotheswasher_dryg', 'diningroom1', 'diningroom2', 'dishwasher',
                    'disposal1', 'drye1', 'dryg1', 'freezer1', 'furnace', 'furnace2', 'garage1', 'garage2', 
                    'grid', 'heater1', 'heater2', 'heater3', 'housefan1', 'icemaker1', 'jacuzzi1', 'kitchen1', 
                    'kitchen2', 'kitchenapp1', 'kitchenapp2', 'lights_plugs1', 'lights_plugs2', 
                    'lights_plugs3', 'lights_plugs4', 'lights_plugs5', 'lights_plugs6', 'livingroom1', 
                    'livingroom2', 'microwave', 'office1', 'outsidelights_plugs1', 
                    'outsidelights_plugs2', 'oven', 'oven2', 'pool1', 'pool2', 'poollight1', 'poolpump1', 
                    'pump1', 'range1', 'refrigerator', 'refrigerator2', 'security1', 'sewerpump1', 'shed1', 
                    'solar', 'solar2', 'sprinkler1', 'sumppump1', 'utilityroom1', 'venthood1', 'waterheater1', 
                    'waterheater2', 'winecooler1', 'wellpump1', 'leg1v', 'leg2v']

     readableNames = ['air compressor', 'second air compressor', 'third compressor', 'Window AC', 'aquarium', 'first bathroom', 'second bathroom',
                    'first bedroom', 'second bedroom', 'third bedroom', 'fourth bedroom', 'fifth bedroom', 'home battery', 'electric car charger', 'second electric car charger', 'circulating pump', 
                    'washing machine', 'washing machine and dryer', 'dining room', 'additional dining room circuit', 'dishwasher',
                    'garbage disposal', 'electric dryer', 'gas dryer', 'freezer', 'furnace', 'second furnace', 'garage', 'additional garage circuit', 
                    'the grid', 'heater', 'second heater', 'third heater', 'house fan', 'icemaker', 'jacuzzi', 'kitchen', 
                    'additional kitchen circuit', 'kitchen appliance', 'second kitchen appliance', 'light plugs', 'second set of light plugs', 
                    'third set of light plugs', 'fourth set of light plugs', 'fifth set of light plugs', 'sixth set of light plugs', 'living room', 
                    'additional living room circuit', 'microwave', 'office', 'outside light plugs', 
                    'second set of outside light plugs', 'oven', 'second oven', 'pool', 'second pool circuit', 'pool light', 'pool pump', 
                    'pump', 'kitchen range', 'refrigerator', 'second refrigerator', 'security system', 'sewer pump', 'shed', 
                    'solar system', 'second solar system', 'sprinkler', 'sump pump', 'utility room', 'vent hood', 'water heater', 
                    'second water heater', 'wine cooler', 'well pump', 'VOLTAGE1', 'VOLTAGE2']

    let i = dataNames.findIndex(name => name == dataName);
    return readableNames[i];
}

fetch('http://localhost:8000/data')
    .then(response => response.json())
    .then(data => {
        console.log("data read");
        username = data[0]
        applianceType = data[1];
        dates = data[2];
        times = data[3];
        dataPackages = data[4];
    })
    .then(itemOfInterest => {
        
        document.getElementById("userName").innerHTML = "Welcome, " + username;
        
        for (let i = 0; i < (applianceType.length) - 2; ++i) {
            let chart = createNewChart(i, 'firstbox', times, dataPackages[i][0].slice(dataPackages[i][0].length - 96), readableName(applianceType[i]), "Usage today")
            //document.getElementById("select" + i).setAttribute("onchange", function a(){changeChartValues(chart, i, dates, times, dataPackages, readableName(applianceType[i]));})
            document.getElementById("select" + i).onchange = function(){changeChartValues(chart, i, dates, times, dataPackages, readableName(applianceType[i]));};
            console.log("just accessed select" + i);
        }
        //document.getElementById('firstbox').style.height = '100px';

    })

    

    //TODO:
    //probably finish savings today too, so tomorrow is clear for login/registration
    //need to change ALL ROUTING cuz this shit sucks lol, theyre sent to links but links are old files
    //WEB DEPLOYMENT IS A MUST
    //Finish all of user auth, includes reading and writing data to db, 
    //also need to figure out rendering because its weird how its currently working

    //WEEKEND: api??? figure out how to send python data to ports