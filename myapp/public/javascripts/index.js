document.getElementById("go").onclick = function() {
    var name = document.forms["form1"]["Name"].value
    var newRommID = document.forms["form2"]["roomID"].value
    if (newRommID === '') {
        alert('Empty Room ID !')
    } else if (name === '') {
        alert('Empty Name !')
    } else {
        document.cookie = 'roomID='+newRommID;
        document.cookie = 'Name='+name;
        document.location.href="/game";
    };
};