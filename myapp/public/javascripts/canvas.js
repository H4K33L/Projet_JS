
/*socket.on('StartGame',()=>{
    console.log("here")
    const canvas = document.getElementById('MyCanvas')
    const context = canvas.getContext('2d')
    let isDrawing = false

    const draw=(x,y,isDrawing)=>{
        if (!isDrawing) return;
        context.lineWidth = 5
        context.lineCap = 'round'
        context.strokeStyle = 'black'
        context.lineTo(x, y)
        context.stroke()
        context.beginPath()
        context.moveTo(x, y)
    }

    canvas.onclick=()=>{
        canvas.addEventListener('mousemove',()=>{
            canvas.addEventListener('mousedown', (event)=>{
                isDrawing=true
                draw(event.offsetX,event.offsetY,isDrawing)
            })
            canvas.addEventListener('mouseup', (event)=>{
                isDrawing=false
                draw(event.offsetX,event.offsetY,isDrawing)
            })
            const { offsetX, offsetY } = event;
            socket.emit('draw', { x: offsetX, y: offsetY });
        })
    }
})

socket.on('draw', (data) => {
    const { x, y } = data;
    draw(x, y, true);
});
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    context.strokeStyle = 'black';

    context.strokeRect(0, 0, canvas.width, canvas.height);
    let isDrawing = false;
    
    function draw(x, y, isDrawing) {
        if (!isDrawing) return;
        context.lineWidth = 5;
        context.lineCap = 'round';
        context.strokeStyle = 'black';
        context.lineTo(x, y);
        context.stroke();
        context.beginPath();
        context.moveTo(x, y);
    }
    
    canvas.addEventListener('mousedown', (event) => {
        isDrawing = true;
        draw(event.offsetX, event.offsetY, isDrawing);
    });
    
    canvas.addEventListener('mousemove', (event) => {
        draw(event.offsetX, event.offsetY, isDrawing);
    });
    
    canvas.addEventListener('mouseup', () => {
        isDrawing = false;
        context.beginPath();
    });
    
    canvas.addEventListener('mouseout', () => {
        isDrawing = false;
        context.beginPath();
    });

    canvas.addEventListener('mousemove', (event) => {
        if (!isDrawing) return;
        const { offsetX, offsetY } = event;
        socket.emit('draw', { x: offsetX, y: offsetY });
    });
});

socket.on('draw', (data) => {
    const { x, y } = data;
    draw(x, y, true);
});*/