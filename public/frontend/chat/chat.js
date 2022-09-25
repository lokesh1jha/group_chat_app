const chatlog = document.getElementById('chatlog')
const sendbtn = document.getElementById('sendmsg')
const message = document.getElementById('newmessage')

let userId = 1;
let groupId = 1;

const URL = 'http://localhost:3000'



function addMessagesToUI(id, message) {
    const name = (id == userId) ? 'You' : 'Friend';
    chatlog.innerHTML += `
    <tr>
        <td> ${name}: ${message} </td>
    </tr>`;
}

window.addEventListener('load', () => {
    let token = localStorage.getItem("token");
    user = JSON.parse(localStorage.getItem("user"));

    // console.log(user);
    axios.get(`${URL}/user/getMessage`, {
        headers: { Authorization: token },
    })
        .then((response) => {
            console.log(response.data.data);
            localStorage.setItem("usergroup", JSON.stringify(response.data.data));
            let groupdiv = document.getElementById("mygroups");
            let content = "";
            let msgcontent = "";
            for (let i = 0; i < response.data.data.length; i++) {
                let grpname = response.data.data[i].group.name;
                let grpid = response.data.data[i].group.id;
                content += `<div class="grpdetail"><span class="grpele">${grpname}</span><button type="submit" onclick="jumpintogroup(${grpid})" class="grpele btn" id="jumpbtn">Jump In</button><div><label>Enter your message:   
        </label><input type="text" id=${grpid}><button onclick="sendmsg(${grpid})" id="sendbtn">Send</button></div></div>`;
            }
            groupdiv.innerHTML = content;
        })
        .catch((err) => console.log(err));

});


sendbtn.addEventListener('clicked', sendMessage);

function sendMessage() {
    const message = message.value;
    if (message === '') {
        alert('Please type something in Message to send.');
    }
    message.val = '';

    const sendMsg = {
        message,
        userId,
        groupId,
    }
    axios.post(`${URL}/user/sendmessage`, sendMsg)
        .then((response) => {
            console.log(response);
            if (response.status === 200) {
                addMessagesToUI(userID, message);
            }
        }).catch((err) => {
            console.log("Error in sending Message" + err);
        })

}
