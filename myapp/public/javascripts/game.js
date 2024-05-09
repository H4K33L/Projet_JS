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
    socket.emit("Name");
  })

  socket.on("deco", ()=> {
    document.location.href="/";
    alert("You ave been baned !")
  })

  socket.on('playerList', (playerList) => {
    // affichage joueurs
    updatePlayer(playerList);
  })

  document.getElementById("go").addEventListener('click', () => {
    socket.emit('StartGame');
    socket.emit("requestWord")
});

  const updatePlayer = (playerList)=>{
    let playerListElement = document.getElementById('playerList')
    playerListElement.innerHTML = ''
    Object.keys(playerList).forEach(playerID => {
      let playerItem = document.createElement('li')
      let buton = document.createElement('button')//
      buton.textContent = "Ban"//
      buton.onclick = () => {
        socket.emit("banVote",playerID)
        buton.disabled=true
      }//
      playerItem.textContent=playerList[playerID][0]
      playerItem.appendChild(buton)//
      playerListElement.appendChild(playerItem)
    });
  }

  const handleDrawingDuringTurn=() => {
    const canvas = document.getElementById('MyCanvas')

    const white = document.getElementById('white');
    const black = document.getElementById('black'); 
    const lightgrey = document.getElementById('lightgray');
    const grey = document.getElementById('gray');
    const red = document.getElementById('red');
    const darkred = document.getElementById('darkred');
    const orange = document.getElementById('orange');
    const yellow = document.getElementById('yellow');
    const lightgreen = document.getElementById('lightgreen');
    const green = document.getElementById('green');
    const darkgreen = document.getElementById('darkgreen');
    const lightblue = document.getElementById('lightblue');
    const cyan = document.getElementById('cyan');
    const blue = document.getElementById('blue');
    const darkblue = document.getElementById('darkblue');
    const purple = document.getElementById('purple');
    const pink = document.getElementById('pink');
    const brown = document.getElementById('brown')

    const Xsmall= document.getElementById('Xsmall')
    const small= document.getElementById('small')
    const medium= document.getElementById('medium')
    const large= document.getElementById('large')
    const Xlarge= document.getElementById('Xlarge')
    
    const clear = document.getElementById('clear')
    const next = document.getElementById('next')

    const context = canvas.getContext('2d');
    let isDrawing = false;
    let color = 'black'
    let size=3

    const changeColor=(newColor)=>{
      socket.emit('changeColor',newColor)
    }
    const changeSize=(newSize)=>{
      socket.emit('changeSize',newSize)
    }
    const clearCanvas=() =>{
      context.fillStyle = 'white';
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
    const draw = (x, y, isDrawing) => {
      if(!isDrawing)return
      context.fillStyle = color;
      context.beginPath();
      context.arc(x, y, size, 0, 2 * Math.PI, true);
      context.fill(); 
    };
    canvas.addEventListener('mousedown', (event) => {
      isDrawing = true;
      draw(event.offsetX, event.offsetY, isDrawing);
      socket.emit('startDrawing', { x: event.offsetX, y: event.offsetY, draw:isDrawing});
    })
    canvas.addEventListener('mousemove', (event) => {
      draw(event.offsetX, event.offsetY, isDrawing);
      socket.emit('startDrawing', { x: event.offsetX, y: event.offsetY,color, draw:isDrawing});
    })
    
    canvas.addEventListener('mouseup', () => {
      isDrawing = false;
    })
    canvas.addEventListener('mouseout', () => {
      isDrawing = false;
    })

    Xsmall.addEventListener('click',()=>{
      size = 1
      changeSize(size)
    })
    small.addEventListener('click',()=>{
      size = 3
      changeSize(size)
    })
    medium.addEventListener('click',()=>{
      size = 5
      changeSize(size)
    })
    large.addEventListener('click',()=>{
      size = 7
      changeSize(size)
    })
    Xlarge.addEventListener('click',()=>{
      size = 9
      changeSize(size)
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
      color = 'lightgray'
      changeColor(color)
    })
    grey.addEventListener('click',()=>{
      color = 'gray'
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
    lightgreen.addEventListener('click',()=>{
      color = 'lightgreen'
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
    next.addEventListener('click',()=>{
      socket.emit('next')
    })
    socket.on('clearAll',()=>{
      clearCanvas()
    })    
    socket.on('draw', (allData) => {
      const {x, y} = allData[allData.length-1];
      draw(x, y, true);
    });    socket.on('newColor',(newColor)=>{
      color=newColor
    })    
    socket.on('newSize',(newSize)=>{
      size=newSize
    }) 
  }
 

  socket.on('game', handleDrawingDuringTurn);



const chatInput = document.getElementById('chat-input');


chatInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    sendMessage();
  }
});

const sendMessage = () => {
  const message = chatInput.value.trim();
  if (message !== '') {
    socket.emit('sendMessage', {name:Name,send:message});
    chatInput.value = '';
  }
};

socket.on('newMessage', (data) => {
  updateMessage(data)
});

const updateMessage = (allMessage)=>{
  let messageListElement = document.getElementById('chat-message')
  messageListElement.innerHTML = ''
  Object.keys(allMessage).forEach(message => {
    let messageItem = document.createElement('li')
    messageItem.textContent=allMessage[message]['name']+":"+allMessage[message]['message']
    messageListElement.appendChild(messageItem)
  });
}

const hidden =(word)=>{
  let hiddenWord =""
  for (let i=0;i<word.length;i++){
    if (word.split[""][i] !== "-") {
      hiddenWord += "_";
    } else {
      hiddenWord += "-";
    }
  }
  return hiddenWord
}