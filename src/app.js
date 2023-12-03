const firstBox = document.getElementById('firstbox'); // need to see if this is still necessary
const firstnameIndex = 2;
//let timeData = Array.from(Array(365).keys());
 //figure out a better way to do this
let applianceType = []; //NOTICE: final two "appliances are supposed to just be voltage of wall outlet"
let dataPackages = [];
let times = [];
let dates = [];

function createNewChart(index, bottom, timeData, powerData, appliance, dataType) {
    newChart = document.createElement("canvas");
    bottomElement = document.getElementById(bottom);
    let name = "chart" + index;
    newChart.id = name;
    console.log(name);
    
    bottomElement.appendChild(newChart);
    console.log("attempted to create canvas")

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
            scales: {
                y: {
                    beginAtZero: true
                },
                x: {
                    ticks: {
                        maxTicksLimit: 24
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

    new Chart(name, config)

    newSelect = document.createElement
}

function changeChartValues(name, desiredValues) {

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
        applianceType = data[0];
        dates = data[1];
        times = data[2];
        dataPackages = data[3];
    })
    .then(itemOfInterest => {

        for (let i = 0; i < (applianceType.length) - 2; ++i) {
            createNewChart(i, 'firstbox', times, dataPackages[i][0], readableName(applianceType[i]), "Usage today")
        }
        //document.getElementById('firstbox').style.height = '100px';

    })

    //TODO:
    //make timeData dynamic
    //add dropdown option to let person edit chart
    //probably finish savings today too, so tomorrow is clear for login/registration
    
    //FRIDAY: Finish all of user auth, includes reading and writing data to db, 
    //also need to figure out rendering because its weird how its currently working

    //WEEKEND: api??? figure out how to send python data to ports
    //BEYOND: continue bug fixes, mainly figure out web deployment