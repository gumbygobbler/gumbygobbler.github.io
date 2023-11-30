const firstBox = document.getElementById('firstbox'); // need to see if this is still necessary
const firstnameIndex = 2;
let timeData = Array.from(Array(365).keys()); //figure out a better way to do this
let applianceType = []; //NOTICE: final two "appliances are supposed to just be voltage of wall outlet"
let dataPackages = [];

function createNewChart(name, bottom, timeData, powerData, appliance, dataType) {
    newChart = document.createElement("canvas");
    bottomElement = document.getElementById(bottom);
    newChart.id = name;
    
    bottomElement.appendChild(newChart);
    console.log("attempted to create canvas")
    console.log(newChart.id);

    new Chart(name, {
        type: "line",
        data: {
            labels: timeData,
            datasets: [{
                label: dataType + ' of ' + appliance + ' in kwatt/h',
                backgroundColor:"rgb(44, 141, 206)",
                borderColor: "rgba(0,0,255,0.1)",
                data: powerData
            }]    
        }   
    })
}

function changeChartValues(name, desiredValues) {

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
        dataPackages = data[1];
    })
    .then(itemOfInterest => {

        createNewChart('newChart', 'firstbox', timeData, dataPackages[0][0], applianceType[0], "Daily Average")
        createNewChart('newChart2', 'firstbox', timeData, dataPackages[1][0], applianceType[1], "Daily Average")
        //will need to find a better way to name these charts

    })

    //TODO:
    //Make a function to map readable appliance names to data appliance names
    //find a better way to name charts
    //find a way to RESIZE THE FUCKING CHARTS
    //probably finish savings today too, so tomorrow is clear for login/registration

    //THURSDAY: Finish all of user auth, includes reading and writing data to db, 
    //also need to figure out rendering because its weird how its currently working
    //FRIDAY: api??? figure out how to send python data to ports
    //WEEKEND AND BEYOND: continue bug fixes, mainly figure out web deployment