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

socket.on('requestName', () => {
  socket.emit("Name", Name);
})

socket.on('playerList', (playerList) => {
  // affichage joueurs
})

document.getElementById("go").onclick = () => {
  socket.emit('StartGame');
};

socket.on('StartGame', (playerName) => {
  // aficher le canva
})