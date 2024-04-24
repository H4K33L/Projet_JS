const { nanoid } = require('nanoid');

class Room {
    constructor(io, socket) {
        this.io = io;
        this.socket = socket;
    }

    createPrivateRoom(player) {
        const { socket } = this;
        const id = nanoid(15);
        games[id] = {
            rounds: 2,
            time: 40 * 1000,
            customWords: [],
            language: 'French',
        };
        games[id][socket.id] = {
            score: 0,
            name: player.name,
            avatar: player.avatar,
        };
        console.log(games);
        socket.player = player;
        socket.roomID = id;
        socket.join(id);
        socket.emit('newPrivateRoom', { gameID: id });
    }

    async joinRoom(data) {
        const { io, socket } = this;
        const roomID = data.id;
        const players = Array.from(await io.in(roomID).allSockets());
        games[roomID][socket.id] = {
            score: 0,
            name: data.player.name,
            avatar: data.player.avatar,
        };
        socket.player = data.player;
        socket.join(roomID);
        socket.roomID = roomID;
        socket.to(roomID).emit('joinRoom', data.player);
        socket.emit('otherPlayers', players.reduce((acc, id) => {
            if (socket.id !== id) {
                const { player } = io.of('/').sockets.get(id);
                acc.push(player);
            }
            return acc;
        }, []));
    }
}

module.exports = Room;
