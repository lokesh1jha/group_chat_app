const URL = 'http://localhost:3000'
let ACTIVEUSERID = 0;
let ACTIVEGROUPID = 0;


// ------------------------------------------------------------------
// -------------------- First Load Page -----------------------------
// ------------------------------------------------------------------


window.addEventListener("DOMContentLoaded", () => {
    let token = localStorage.getItem("token");
    user = JSON.parse(localStorage.getItem("user"));

    // console.log(user);
    axios.get(`${URL}/group/fetchGroup`, {
        headers: { Authorization: token },
    })
        .then((response) => {
            console.log(response.data.data);
            localStorage.setItem("usergroup", JSON.stringify(response.data.data));
            let groupdiv = document.getElementById("groupslist");
            console.log(response)
            let content = "";
            for (let i = 0; i < response.data.data.length; i++) {
                let grpname = response.data.data[i].group.name;
                let grpid = response.data.data[i].group.id;
                content += `<div class="grpdetail" value="${grpid}">
                ${grpname} &nbsp;&nbsp; <button type="submit" onclick="expandgroup(${grpid})" id="jumpbtn">Messages</button>
                </div>`
            }
            groupdiv.innerHTML = content;
        })
        .catch((err) => console.log(err));

});




// ------------------------------------------------------------------
// ----------------------Left Side Page -----------------------------
// ------------------------------------------------------------------


const createnewgroupbtn = document.getElementById('createnewgroup');
const formarea = document.getElementById('newgroupform');


createnewgroupbtn.addEventListener('click', opengroupform);
function opengroupform(e) {
    e.preventDefault();
    formarea.innerHTML = `<form action="" method="post">
    <input type="text" id="grpname" placeholder="Group Name">
    <button type="button" id="newgroupbtn" onClick="creategroup()">Create</button>
</form>`
}

function creategroup() {
    let token = localStorage.getItem("token");
    let groupname = document.getElementById('grpname').value;
    let obj = {
        name: groupname,
    };
    console.log('Group name ' + groupname);

    axios
        .post(`${URL}/group/creategroup`, obj, {
            headers: { Authorization: token },
        })
        .then((response) => {
            if (response.status == 201) {
                console.log(response);
                // alert(response.data.message);

                //remove the form
                formarea.innerHTML = '';

                //list the grooup in list
                let groupslist = document.getElementById("groupslist");
                let grpid = response.data.response.groupId;
                groupslist.innerHTML += `<div class="grpdetail" value="${grpid}">
                ${grpname} &nbsp;&nbsp; <button type="submit" onclick="expandgroup(${grpid})" id="jumpbtn">Messages</button>
                &nbsp;&nbsp;<button onClick="moreforadmin(${grpid})"> ... </button> 
                </div><div id="group${grpid}" class="adminfeature hidefornonadmin"></div>`
            } else {
                throw new Error();
            }
        })
        .catch((err) => console.log(err)); 
}


// ------------------------------------------------------------------
// ----------------------Left Side Page (ADMIN START) ---------------------
// ------------------------------------------------------------------


function moreforadmin(groupid) {
    const adminform = document.getElementById(`group${groupid}`)

    axios.get(`${URL}/admin/isadmin/:groupid=${groupid}`)
    .then((res) => {
        if(res.status === 200){
            adminform.innerHTML = adminfeatureform;
        }
    })
    .catch((err) => {
        console.log(err + " isAdmin failed")
    })
}


function getmembers(groupid) {
    let token = localStorage.getItem("token");
    axios
      .get(`${URL}/group/getmembers/${groupid}`, {
        headers: { Authorization: token },
      })
      .then((response) => {
        console.log(response);
       
        let userId = JSON.parse(localStorage.getItem("user"));
        ACTIVEUSERID = userId;
        ACTIVEGROUPID = groupid;


        let usergroups = JSON.parse(localStorage.getItem("usergroup"));
        let usergroup = null;
        for (let i = 0; i < usergroups.length; i++) {
          if (groupid == usergroups[i].groupId) {
            usergroup = usergroups[i];
            break;
          }
        }
  
        let parent = document.getElementById("groupmembers");
        let parent2 = document.getElementById("groupmembers2")
        let onemoreparent = document.getElementById("addmems");
        let content = "";
        let onemorecontent = "";
        let anothercontent = '';
        for (let i = 0; i < response.data.data.length; i++) {
          let name = response.data.data[i].user.name;
          let id = response.data.data[i].user.id;
          let isAdmin = response.data.data[i].isadmin;
          if (userId[0].id == id) {
            content += "";
            if (isAdmin) {
              onemorecontent = `<label class="addduser">Add User :</label><input type = "text" id="name" class="addduser">
                                  <button onclick="adduser(${groupid})">Add</button>`;
            }
          } else {
            console.log(usergroup.isadmin);
            if (usergroup.isadmin != true) {
              content += `<div class="userdiv"><span class="userele">${name}</span>`;
            } else {
              if (usergroup.isadmin == true) {
                content += `<div class="userdiv"><span class="userele" id="username">${name}</span>
                <button class="userele" onclick="makeadmin(${groupid},${id})">Make_Admin</button>
                <button class="userele" onclick= "removeuser(${groupid},${id})">Remove_User</button></div>`;
                onemorecontent = `<label class="addduser">Add User :</label><input type = "text" id="name" class="addduser">
                                  <button onclick="adduser(${groupid})">Add</button>`;
              }
              if (isAdmin == true) {
               
                content = `<div class="userdiv"><span class="userele">${name}</span>
                <button class="userele" onclick="removeadmin(${groupid},${id})">remove admin</button>
               
                <button class="userele" onclick= "removeuser(${groupid},${id})">remove</button></div>`;
                onemorecontent = `<label class="addduser">Add User :</label><input type = "text" id="name" class="addduser">
                                  <button onclick="adduser(${groupid})">Add</button>`;
              } 
            }
          }
        }
        onemoreparent.innerHTML = onemorecontent;
        parent.innerHTML = content;
        parent2.innerHTML = anothercontent
      })
      .catch((err) => console.log(err));
  }
  
  
  
  //Add Existing User to the group
  
  function adduser(groupid) {
    let name = document.getElementById("name").value;
  
    let obj = {
      name: name,
    };
    axios
      .post(`${URL}/admin/adduser/${groupid}`, obj)
      .then((response) => {
        if (response.status == 201) {
          console.log(response);
          alert("User Added");;
        } else {
          throw new Error();
        }
      })
      .catch((err) => alert("User Does not exist"));
  }
  
  //Remove user from group
  
  function removeuser(groupid, userid) {
    axios
      .post(`${URL}/admin/removeuser/${groupid}`, { userid: userid })
      .then((response) => {
        if (response.status == 200) {
          console.log(response);
          alert("User Removed");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  
  //Make a user admin
  
  function makeadmin(groupid, userid) {
    axios
      .post(`${URL}/admin/makeadmin/${groupid}`, { userid: userid })
      .then((response) => {
        alert("Successful");
      })
      .catch((err) => {
        console.log(err);
      });
  }
  
  //Remove a User admin status
  
  function removeadmin(groupid, userid) {
    axios
      .post(`${URL}/admin/removeadmin/${groupid}`, { userid: userid })
      .then((response) => {
        if (response.status == 200) {
          alert("Successful");
        } 
      })
      .catch((err) => {
        console.log(err);
      });
  }


// ------------------------------------------------------------------
// ----------------------Left Side Page (ADMIN END)------------------
// ------------------------------------------------------------------


function expandgroup(grpid) {
    retrivemsg(grpid);
    getmembers(grpid);
}

function retrivemsg(groupid) {
    axios.get(`${URL}/user/getmessage/${groupid}`).then((response) => {
        let chatlog = document.getElementById("chatlog");
        let content = "";
        console.log(response)
        for (let i = 0; i < response.data.data.length; i++) {
            let message = response.data.data[i].message;
            let name = response.data.data[i].user.name;
            content += `<tr>
                        <td>${name}: ${message}</td>
                    </tr>`
        }
        chatlog.innerHTML = content;
    });
}

// -------------------------------------------------------------------
// ----------------------Right Side Page -----------------------------
// -------------------------------------------------------------------

//Message box to be handeled here 
const chatlog = document.getElementById('chatlog')
const sendbtn = document.getElementById('sendmsg')
const newmessage = document.getElementById('newmessage')


function addMessagesToUI(id, message) {
    const name = (id == userId) ? 'You' : 'Friend';
    chatlog.innerHTML += `
    <tr>
        <td> ${name}: ${message} </td>
    </tr>`;
}



sendbtn.addEventListener('click', sendMessage);

function sendMessage() {
    console.log("send")
    const message = newmessage.value;
    if (message === '') {
        alert('Please type something in Message to send.');
    }
    newmessage.value = '';
    let groupid = ACTIVEGROUPID;
    
    let obj = {
        message: message,
      };
      const token = localStorage.getItem("token");
      axios
        .post(`${URL}/user/sendmessage/${groupid}`, obj, {
          headers: { Authorization: token },
        })
        .then((response) => {
          console.log(response);
    
          if (response.status == 201) {
            retrivemsg(groupid);
          }
        })
        .catch((err) => {
            console.log("Error in sending Message" + err);
        });
}
