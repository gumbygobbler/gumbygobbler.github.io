async function register() {
    
    let firstname = document.getElementById("fname").value;
    let lastname = document.getElementById("lname").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let password2 = document.getElementById("password2").value;

    const data = {
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: password,
        password2: password2
    }
    console.log(data)

    if(password != password2) {
        alert("Passwords must match")
    }
    else {
        const response = await fetch("http://localhost:8000/users/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
        console.log(response)

        if (response.status == 201) {
        window.location.href = "https://www.sdsuproject.com/UserStats"
        }
        else {
            (alert("Incorrect email or password"))
        }
    }
    
}