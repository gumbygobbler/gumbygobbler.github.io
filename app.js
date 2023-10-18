// function init() {
//     const header = document.createElement("div");
//     header.setAttribute("class", "testContainer");
//     header.innerHTML = "check to see this works";
//   document.body.appendChild(header);
// }

// init();

const firstBox = document.getElementById('firstbox');
const firstnameIndex = 2;
//queryselector can find a whole load of things with parameters, but will be slower than 
//getElement methods.
//for ids, use #

fetch('https://www.sdsuproject.com/')
    .then(response => response.json())
    .then(data => {
        console.log(data)
        //firstName = Object.values(data[0])[firstnameIndex];
        //firstBox.innerHTML = firstName;
    })
    .catch(err => console.log(err))

    
