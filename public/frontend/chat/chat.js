const chatlog = document.getElementById('chatlog')
const sendbtn = document.getElementById('sendmsg')
const message = document.getElementById('newmessage')

let userId = 1;
let groupId = 1;

const URL = 'http://localhost:3000'



function addMessagesToUI(id, message) {
    const name = (id == userId)?'You':'Friend';
    chatlog.innerHTML += `
    <tr>
        <td> ${name}: ${message} </td>
    </tr>`;
}

window.addEventListener('load', () => {
    // userId = parseInt(localStorage.getItem(userDetails).id);

    axios.get(`${URL}/user/getMessage?userid=${userId}`)
    .then((message)=> {
        console.log(message);
        // messages.data.message.forEach(element => {
        //     addMessagesToUI(userId, element)
        // });
    })
});


sendbtn.addEventListener('clicked', sendMessage);

function sendMessage() {
    const message = message.value;
    if(message === ''){
        alert('Please type something in Message to send.');
    }
    message.val = '';

    const sendMsg = {
        message,
        userId,
        groupId,
    }
    axios.post(`${URL}/user/sendmessage`, sendMsg)
    .then( (response) => {
    console.log(response);
    if(response.status === 200){
        addMessagesToUI(userID, message);
    }
    }).catch((err) => {
        console.log("Error in sending Message" + err);
    })

}
