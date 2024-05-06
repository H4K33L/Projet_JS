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

const updatePlayer = (playerList)=>{
  let playerListElement = document.getElementById('playerList')
  playerListElement.innerHTML = ''
  Object.keys(playerList).forEach(playerName => {
    let playerItem = document.createElement('li')
    playerItem.textContent=playerList[playerName]
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

  const clear = document.getElementById('clear');

  const context = canvas.getContext('2d');
  let isDrawing = false;
  let color = 'black';

  const changeColor=(newColor)=>{
    socket.emit('changeColor',newColor)
  }
  const clearCanvas=() =>{
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  const draw = (x, y, isDrawing) => {
    if (!isDrawing) return;
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, 1, 0, 2 * Math.PI, true);
    context.fill(); 
  };

  canvas.addEventListener('mousedown', (event) => {
    isDrawing = true;
    draw(event.offsetX, event.offsetY, isDrawing);
    socket.emit('startDrawing', { x: event.offsetX, y: event.offsetY, draw:isDrawing});
  });

  canvas.addEventListener('mousemove', (event) => {
    draw(event.offsetX, event.offsetY, isDrawing);
    socket.emit('startDrawing', { x: event.offsetX, y: event.offsetY,color, draw:isDrawing});
  });

  canvas.addEventListener('mouseup', () => {
    isDrawing = false;
  });

  canvas.addEventListener('mouseout', () => {
    isDrawing = false;
  });

  socket.on('draw', (allData) => {
      const { x, y} = allData[allData.length-1];
      draw(x, y, true);
  });

  socket.on('clearAll',()=>{
    clearCanvas()
  })

  socket.on('newColor',(newColor)=>{
    console.log(newColor)
    color=newColor
  })

  clear.addEventListener('click', ()=>{
    socket.emit('clear')
    clearCanvas()
  })
  white.addEventListener('click',()=>{
    color = 'white'
    changeColor(color)
  })
  black.addEventListener('click',()=>{
    color = 'black'
    changeColor(color)
  })
  lightgrey.addEventListener('click',()=>{
    color = 'lightgrey'
    changeColor(color)
  })
  grey.addEventListener('click',()=>{
    color = 'grey'
    changeColor(color)
  })
  red.addEventListener('click',()=>{
    color = 'red'
    changeColor(color)
  })
  darkred.addEventListener('click',()=>{
    color = 'darkred'
    changeColor(color)
  })
  orange.addEventListener('click',()=>{
    color = 'orange'
    changeColor(color)
  })
  yellow.addEventListener('click',()=>{
    color = 'yellow'
    changeColor(color)
  })
  green.addEventListener('click',()=>{
    color = 'green'
    changeColor(color)
  })
  darkgreen.addEventListener('click',()=>{
    color = 'darkgreen'
    changeColor(color)
  })
  lightblue.addEventListener('click',()=>{
    color = 'lightblue'
    changeColor(color)
  })
  cyan.addEventListener('click',()=>{
    color = 'cyan'
    changeColor(color)
  })
  blue.addEventListener('click',()=>{
    color = 'blue'
    changeColor(color)
  })
  darkblue.addEventListener('click',()=>{
    color = 'darkblue'
    changeColor(color)
  })
  purple.addEventListener('click',()=>{
    color = 'purple'
    changeColor(color)
  })
  pink.addEventListener('click',()=>{
    color = 'pink'
    changeColor(color)
  })
  brown.addEventListener('click',()=>{
    color = 'brown'
    changeColor(color)
  })
});