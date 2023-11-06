const firstBox = document.getElementById('firstbox');
const firstnameIndex = 2;
let timeData = [];
let gridData = [];
//queryselector can find a whole load of things with parameters, but will be slower than 
//getElement methods.
//for ids, use #

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
        console.log(timeData[0], gridData[0]);

        //needs to change to time
        // data.forEach((element => timeData.push(Object.values(element)[1])))
        // data.forEach((element => gridData.push(Object.values(element)[7]))) 
    })

chart = new Chart(document.getElementById('chart1'), {
    type: "line",
    data: {
        labels: timeData,
        datasets: [
            {
            label: "kwatt/h",
            data: gridData,
            backgroundColor:"rgb(44, 141, 206)"
            }
        ]
    }
})
    
