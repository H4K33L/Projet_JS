import { io } from "https://cdn.socket.io/4.7.4/socket.io.esm.min.js";

window.socket = io();

let roomID = document.cookie
  .split("; ")
  .find((row) => row.startsWith("roomID="))
  ?.split("=")[1];
socket.emit("room", roomID);

let Name = document.cookie
.split("; ")
.find((row) => row.startsWith("Name="))
?.split("=")[1];

socket.emit("Name", Name);
socket.on('requestName', () => {
  socket.emit("Name", Name);
})

socket.on('playerList', (playerList) => {
  // affichage joueurs
  updatePlayer(playerList);
})

document.getElementById("go").onclick = () => {
  socket.emit('StartGame');
};

socket.on('StartGame', (playerName) => {
  // afficher le canva
})

const updatePlayer = (playerList)=>{
  let playerListElement = document.getElementById('playerList')
  playerListElement.innerHTML = ''
  Object.keys(playerList).forEach(playerName => {
    let playerItem = document.createElement('li')
    playerItem.textContent=playerList[playerName]
    playerListElement.appendChild(playerItem)
  });
}