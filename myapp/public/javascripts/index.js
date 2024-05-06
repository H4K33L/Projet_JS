import { io } from "https://cdn.socket.io/4.7.4/socket.io.esm.min.js";

document.getElementById("go").onclick = function() {
    var name = document.forms["form1"]["Name"].value
    var newRommID = document.forms["form2"]["roomID"].value
    if (newRommID === '') {
        alert('Empty Room ID !')
    } else if (name === '') {
        alert('Empty Name !')
    } else {
        window.socket = io();
        socket.emit('check name',[name,newRommID])
        socket.on("goodName", bool => {
            if (bool) {
                document.cookie = 'roomID='+newRommID;
                document.cookie = 'Name='+name;
                document.location.href="/game";
            } else {
                alert('This name are alredy used in this room !')
            }
        })
    };
};