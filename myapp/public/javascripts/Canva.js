class Canva {
    constructor(io, socket) {
        this.io = io;
        this.socket = socket;
    }

    broadcastDrawing(info) {
        const { socket } = this;
        socket.broadcast.to(socket.roomID).emit('drawing', info);
    }

    clearCanvas() {
        const { socket } = this;
        socket.broadcast.to(socket.roomID).emit('clearCanvas');
    }
}

module.exports = Canva;