async function login() {
    
    let email = document.getElementById("username").value;
    let password = document.getElementById("pass").value;
    document.getElementById('form').addEventListener('submit', function(event) {

        event.preventDefault();
    })
    const data = {
        email: email,
        password: password
    }
    console.log(data)
    const response = await fetch("http://localhost:8000/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
    })
    console.log(response)

    if (response.status == 200) {
        window.location.href = "https://www.sdsuproject.com/UserStats"
    }
    else {
        (alert("Incorrect email or password"))
    }
}