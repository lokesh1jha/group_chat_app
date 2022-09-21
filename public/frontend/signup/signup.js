const registerbtn = document.getElementById('register');
const URLTOBACKEND = 'http://localhost:3000/';

registerbtn.addEventListener('click', registerUser);

function registerUser(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;

    if (name === '' || email === '' || phone === '' || password === '') {
        alert('Please fill all the fields');
        return;   
    }
    const User = {
        name,
        email,
        phone,
        password
    }
    console.log(User);
    axios.post(`${URLTOBACKEND}user/signup`, User)
        .then(res => {
            if(res.status === 201){
                alert("Successfuly signed up")}
            // }else if(res.status === 400){
            //     alert(res.data.messsage);
            // }
            else {
                console.log("User Registration failed")
                throw new Error(res.data.messsage);
            }
        })
        .catch(err => {
            alert("Your Email Id is already registerd.")
            console.log("error " + err);
        })
    
    document.getElementById('signupForm').reset();

}