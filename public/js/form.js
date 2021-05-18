



const inviteVisitorForm = document.getElementById('inviteVisitor'); 

inviteVisitorForm.addEventListener('submit', (event) => {
event.preventDefault();



const visitorEmail = document.getElementById('emailAddress').value;
if (visitorEmail == '') {
    visitorEmail.reportValidity();
    return false;
}

const userPassword = document.getElementById('password').value;
if (userPassword == '') {
    userPassword.reportValidity();
    return false;
}







//prepare init for fetch
const init = {
      method: 'Post',
      redirect: 'manual',
      headers: {
          'Content-Type': 'application/json'
      },
      //credentials: 'same-origin',
      body: JSON.stringify({ visitorEmail,userPassword })
  }

  




//call fetch
await fetch('http://localhost:3003/users/invite-request', init)
    .then(response => response.json())
    
    .then(data => {
/*
        document.getElementById("submitCreateUserForm").classList.remove("is-loading");
        //set notification
        document.getElementById("notificationMessage").innerHTML = 'User creation successful';
        //add notification color class sent
        document.getElementById("notification").classList.add("is-success");
        //remove is-hidden from notificationWrapper
        document.getElementById("notification").classList.remove("is-hidden");*/

    })
    .catch(error => {
        //remove spinner class
       /* document.getElementById("submitCreateUserForm").classList.remove("is-loading");

        document.getElementById("notificationMessage").innerHTML = error.message;
        //add notification color class sent
        document.getElementById("notification").classList.add("is-danger");
        //remove is-hidden from notificationWrapper
        document.getElementById("notification").classList.remove("is-hidden");*/

    }); 


})

