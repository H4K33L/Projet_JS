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
  updatePlayer(playerList);
})

document.getElementById("go").onclick = () => {
  socket.emit('StartGame');
};

const updatePlayer = (playerList)=>{
  let playerListElement = document.getElementById('playerList')
  playerListElement.innerHTML = ''
  playerList.forEach(playerName => {
    let playerItem = document.createElement('li')
    playerItem.textContent=playerName
    playerListElement.appendChild(playerItem)
  });
}

socket.on('game', () => {
  const canvas = document.getElementById('MyCanvas');

  const white = document.getElementById('white');
  const black = document.getElementById('black');
  const lightgrey = document.getElementById('lightgrey');
  const grey = document.getElementById('grey');
  const red = document.getElementById('red');
  const darkred = document.getElementById('darkred');
  const orange = document.getElementById('orange');
  const darkorange = document.getElementById('darkorange');
  const yellow = document.getElementById('yellow');
  const green = document.getElementById('green');
  const darkgreen = document.getElementById('darkgreen');
  const lightblue = document.getElementById('lightblue');
  const cyan = document.getElementById('cyan');
  const blue = document.getElementById('blue');
  const darkblue = document.getElementById('darkblue');
  const purple = document.getElementById('purple');
  const pink = document.getElementById('pink');
  const brown = document.getElementById('brown');

  const context = canvas.getContext('2d');
  let isDrawing = false;
  let color = 'black';

  const draw = (x, y, isDrawing,colorline) => {
    if (!isDrawing) return;
    context.fillStyle = colorline;
    context.beginPath();
    context.arc(x, y, 1, 0, 2 * Math.PI, true);
    context.fill(); 
  };

  canvas.addEventListener('mousedown', (event) => {
    isDrawing = true;
    draw(event.offsetX, event.offsetY, isDrawing);
    socket.emit('startDrawing', { x: event.offsetX, y: event.offsetY, color, isDrawing ,color});
  });

  canvas.addEventListener('mousemove', (event) => {
    draw(event.offsetX, event.offsetY, isDrawing);
    socket.emit('startDrawing', { x: event.offsetX, y: event.offsetY,color, isDrawing,color });
  });

  canvas.addEventListener('mouseup', () => {
    isDrawing = false;
  });

  canvas.addEventListener('mouseout', () => {
    isDrawing = false;
  });

  socket.on('draw', (allData) => {
    allData.forEach(data => {
      const { x, y, colorline } = data;
      if(colorline) {
        currentColor = colorline;
      }
      
      draw(x, y, true,colorline);
    });
  });

  white.addEventListener('click',()=>{
    color = 'white'
  })
  black.addEventListener('click',()=>{
    color = 'black'
  })
  lightgrey.addEventListener('click',()=>{
    color = 'lightgrey'
  })
  grey.addEventListener('click',()=>{
    color = 'grey'
  })
  red.addEventListener('click',()=>{
    color = 'red'
  })
  darkred.addEventListener('click',()=>{
    color = 'darkred'
  })
  orange.addEventListener('click',()=>{
    color = 'orange'
  })
  yellow.addEventListener('click',()=>{
    color = 'yellow'
  })
  green.addEventListener('click',()=>{
    color = 'green'
  })
  darkgreen.addEventListener('click',()=>{
    color = 'darkgreen'
  })
  lightblue.addEventListener('click',()=>{
    color = 'lightblue'
  })
  cyan.addEventListener('click',()=>{
    color = 'cyan'
  })
  blue.addEventListener('click',()=>{
    color = 'blue'
  })
  darkblue.addEventListener('click',()=>{
    color = 'darkblue'
  })
  purple.addEventListener('click',()=>{
    color = 'purple'
  })
  pink.addEventListener('click',()=>{
    color = 'pink'
  })
  brown.addEventListener('click',()=>{
    color = 'brown'
  })
});