import {
signOut
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

logoutBtn.onclick=()=>{

signOut(auth);

}
import {
sendPasswordResetEmail
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

sendPasswordResetEmail(auth,email)
.then(()=>{

alert("Password Reset Email Sent");

});

import { auth } from "./firebase-config.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

onAuthStateChanged(auth,user=>{

if(user){

console.log(user.email);

}else{

window.location.href="login.html";

}

});
