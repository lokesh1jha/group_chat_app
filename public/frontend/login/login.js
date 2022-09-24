const URL = 'http://localhost:3000';

document.getElementById('loginForm').addEventListener('submit', loginUser);

function loginUser(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const user = {
        email,
        password
    }

    axios.post(`${URL}/user/login`, user)
        .then(res => {
            if (res.status == 200) {
                localStorage.setItem("user", JSON.stringify(response.data.user));
                localStorage.setItem("token", response.data.token);
                localStorage.setItem(
                    "usergroup",
                    JSON.stringify(response.data.usergroup)
                );
                window.location.href = "../chat/chat.html"; // change the page on successful login                
            } else {
                console.log("User Login failed");
                throw new Error('Failed to login');
            }
        })
        .catch(err => {
            document.body.innerHTML += `<div style="color:red;">${err} <div>`;
        })
}