const userInfo = document.getElementById('username');
const passInfo = document.getElementById('pass');
const loginBox = document.getElementById('loginbox');

async function login(e) {
    e.preventDefault();
    const username = userInfo.value;
    const password = passInfo.value;

    try {
        const res = await fetch('http://localhost:8000/', {
            method: 'POST',
            headers: { "Content_Type": 'application/json'},
            body: JSON.stringify({username, password})
        })
        .then(response => response.json())
        .then(console.log(wentThrough))


    }
    catch(err) {
        console.log('whoops');
    }
}

loginBox.addEventListener('submit', login(), false);