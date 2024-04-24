//-------------------------------------------------------------------- info

import { io } from "https://cdn.socket.io/4.7.4/socket.io.esm.min.js";

const socket = io();
const params = window.location.toString().substring(window.location.toString().indexOf('?'));
const searchParams = new URLSearchParams(params);
const copyBtn = document.querySelector('#copy');
let language = 'French';

const putPlayer = (player) => {
    const div = document.createElement('div');
    const img = document.createElement('img');
    const p = document.createElement('p');
    const text = document.createTextNode(player.name);
    div.id = `skribblr-${player.id}`;
    p.appendChild(text);
    p.classList.add('text-center');
    img.src = player.avatar;
    img.alt = player.name;
    img.classList.add('img-fluid', 'rounded-circle');
    div.classList.add('col-4', 'col-sm-3', 'col-md-4', 'col-lg-3');
    img.onload = async () => {
        div.appendChild(img);
        div.appendChild(p);
        document.querySelector('#playersDiv').appendChild(div);
        pop.play();
        await animateCSS(div, 'fadeInDown', false);
    };
};

const showCanvasArea = () => {
    const sketchpad = document.createElement('script');
    const canvas = document.createElement('script');
    sketchpad.src = 'https://cdn.jsdelivr.net/npm/responsive-sketchpad/dist/sketchpad.min.js';
    canvas.src = './canvas.js';
    document.body.append(sketchpad);
    sketchpad.addEventListener('load', async () => {
        document.body.append(canvas);
        animateCSS('#settings>div', 'fadeOutLeft');
        animateCSS('#settings>div:nth-of-type(2)', 'fadeOutRight');
        document.querySelector('#gameZone').classList.remove('d-none');
        await animateCSS('#gameZone', 'fadeInDown');
        document.querySelector('#settings').remove();
    });
};

socket.on('joinRoom', putPlayer);
socket.on('otherPlayers', (players) => players.forEach((player) => putPlayer(player)));
socket.on('disconnection', async (player) => {
    if (document.querySelector(`#skribblr-${player.id}`)) {
        exit.play();
        await animateCSS(`#skribblr-${player.id}`, 'fadeOutUp');
        document.querySelector(`#skribblr-${player.id}`).remove();
    }
});
socket.on('startGame', showCanvasArea);

const updateSettings = () => {
    document.querySelector('#rounds').setAttribute('disabled', true);
    document.querySelector('#time').setAttribute('disabled', true);
    document.querySelector('#startGame').setAttribute('disabled', true);
    document.querySelector('#language').setAttribute('disabled', true);
};

const joinGame = async () => {
    await animateCSS('#landing>div>div', 'hinge');
    document.querySelector('#landing').remove();
    document.querySelector('#settings').classList.remove('d-none');
    await animateCSS('#settings div', 'jackInTheBox');
    my.id = socket.id;
    if (searchParams.has('id')) {
        document.querySelector('#gameLink').value = `${window.location.protocol}//${window.location.host}/?id=${searchParams.get('id')}`;
        putPlayer(my);
    }
    socket.emit('joinRoom', { id: searchParams.get('id'), player: my });
};

const createGame = async () => {
    await animateCSS('#landing>div>div', 'hinge');
    document.querySelector('#landing').remove();
    document.querySelector('#settings').classList.remove('d-none');
    animateCSS('#settings div', 'jackInTheBox');
    await animateCSS('#settings>div:nth-of-type(2)', 'jackInTheBox');
    my.id = socket.id;
    socket.emit('newPrivateRoom', my);
    socket.on('newPrivateRoom', (data) => {
        document.querySelector('#gameLink').value = `${window.location.protocol}//${window.location.host}/?id=${data.gameID}`;
        putPlayer(my);
    });
};

if (searchParams.has('id')) {
    updateSettings();
    document.querySelector('#playGame').addEventListener('click', joinGame);
} else {
    document.querySelector('#rounds').addEventListener('input', updateSettings);
    document.querySelector('#time').addEventListener('input', updateSettings);
    document.querySelector('#customWords').addEventListener('change', updateSettings);
    document.querySelector('#probability').addEventListener('change', updateSettings);
    document.querySelector('#language').addEventListener('change', updateSettings);
    document.querySelector('#createRoom').addEventListener('click', createGame);
}

copyBtn.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('#gameLink').select();
    document.execCommand('copy');
});

document.querySelector('#startGame').addEventListener('click', async () => {
    showCanvasArea();
    socket.emit('startGame');
    socket.emit('getPlayers');  
});

document.querySelector('#language').addEventListener('input',  () => {
    language = this.value;
    if (language === 'French') return;
    const script = document.createElement('script');
    document.body.append(script);
});

//--------------------------------------------------------- Canva

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

//--------------------------------------------------------- canvas

const canvas = document.getElementById('sketchpad');
const smBrush = document.getElementById('sm-brush');
const mdBrush = document.getElementById('md-brush');
const lgBrush = document.getElementById('lg-brush');
const xlBrush = document.getElementById('xl-brush');
const clearCanvas = document.getElementById('clearCanvas');
const colors = Array.from(document.getElementsByClassName('color'));
const pad = new Sketchpad(canvas, {
    line: {
        size: 5,
    },
    aspectRatio: 5 / 8,
});
const current = {
    lineColor: '#000',
    lineSize: 5,
};
pad.setReadOnly(true);

const setLineSize = () => {
    if (pad.readOnly) return;
    current.lineSize = Number(this.dataset.linesize);
    pad.setLineSize(Number(this.dataset.linesize));
};

const onMouseDown = (e) => {
    if (!pad.sketching) return;
    const rect = canvas.getBoundingClientRect();
    const { width: w, height: h } = pad.getCanvasSize();
    current.x = (e.clientX - rect.left) / w;
    current.y = (e.clientY - rect.top) / h;
};

const onMouseUp = (e) => {
    if (pad.readOnly) return;
    const rect = canvas.getBoundingClientRect();
    const { width: w, height: h } = pad.getCanvasSize();
    socket.emit('drawing', {
        start: {
            x: current.x,
            y: current.y,
        },
        end: {
            x: (e.clientX - rect.left) / w,
            y: (e.clientY - rect.top) / h,
        },
        lineColor: current.lineColor,
        lineSize: current.lineSize,
    });
};

const onMouseMove = (e) => {
    if (!pad.sketching) return;
    const { width: w, height: h } = pad.getCanvasSize();
    const rect = canvas.getBoundingClientRect();
    socket.emit('drawing', {
        start: {
            x: current.x,
            y: current.y,
        },
        end: {
            x: (e.clientX - rect.left) / w,
            y: (e.clientY - rect.top) / h,
        },
        lineColor: current.lineColor,
        lineSize: current.lineSize,
    });
    current.x = (e.clientX - rect.left) / w;
    current.y = (e.clientY - rect.top) / h;
};

const throttle = (callback, delay) => {
    let previousCall = new Date().getTime();
    return (...args) => {
        const time = new Date().getTime();
        if ((time - previousCall) >= delay) {
            previousCall = time;
            callback(...args);
        }
    };
};

colors.forEach((color) => {
    color.addEventListener('click', () => {
        if (pad.readOnly) return;
        current.lineColor = getComputedStyle(color).backgroundColor;
        pad.setLineColor(current.lineColor);
        document.querySelector('.selected-color').style.backgroundColor = current.lineColor;
    }, false);
});

smBrush.addEventListener('click', setLineSize);
mdBrush.addEventListener('click', setLineSize);
lgBrush.addEventListener('click', setLineSize);
xlBrush.addEventListener('click', setLineSize);
clearCanvas.addEventListener('click', () => {
    if (pad.readOnly) return;
    socket.emit('clearCanvas');
    pad.clear();
});

window.addEventListener('resize', () => pad.resize(canvas.offsetWidth));
canvas.addEventListener('mousedown', onMouseDown);
canvas.addEventListener('mouseup', throttle(onMouseUp, 10));
canvas.addEventListener('mousemove', throttle(onMouseMove, 10));

socket.on('clearCanvas', () => pad.clear());
socket.on('drawing', ({
    start,
    end,
    lineColor,
    lineSize,
}) => {
    const { width: w, height: h } = pad.getCanvasSize();
    start.x *= w;
    start.y *= h;
    end.x *= w;
    end.y *= h;
    pad.setLineColor(lineColor);
    pad.setLineSize(lineSize);
    pad.drawLine(start, end);
    pad.setLineColor(current.lineColor);
    pad.setLineSize(current.lineSize);
});
socket.on('disableCanvas', async () => {
    pad.setReadOnly(true);
    await animateCSS('#tools', 'fadeOutDown');
    document.querySelector('#tools').classList.add('d-none');
});

//--------------------------------------------------------- game


document.querySelectorAll('button').forEach((button) => {
    button.addEventListener('mousedown', () => click.play());
});

const createScoreCard = (players) => {
    players.forEach((player) => {
        const div = document.createElement('div');
        const details = document.createElement('div');
        const p1 = document.createElement('p');
        const p2 = document.createElement('p');
        const name = document.createTextNode(player.name);
        const score = document.createTextNode('Score: 0');

        div.classList.add('row', 'justify-content-end', 'py-1', 'align-items-center');
        details.classList.add('col-7', 'col-xl-6', 'text-center', 'my-auto');
        p1.classList.add('mb-0');
        p2.classList.add('mb-0');
        div.id = `skribblr-${player.id}`;
        div.append(details);
        details.append(p1, p2);
        p1.append(name);
        p2.append(score);
        document.querySelector('.players').append(div);
    });
};

const startTimer = (ms) => {
    let seconds = ms / 1000;
    const id = setInterval(() => {
        const wordP = document.querySelector('#wordDiv > p.lead.fw-bold.mb-0');
        if (seconds === 0) clearInterval(id);
        if (seconds === 10) clock.play();
        document.querySelector('#clock').textContent = seconds;
        if (hints[0] && wordP && seconds === hints[0].displayTime && pad.readOnly) {
            wordP.textContent = hints[0].hint;
            hint.play();
            animateCSS(wordP, 'tada', false);
            hints.shift();
        }
        seconds--;
    }, 1000);
    timerID = id;
    timerStart.play();
    document.querySelectorAll('.players .correct').forEach((player) => player.classList.remove('correct'));
};

const appendMessage = ({ name = '', message, id }, { correctGuess = false, closeGuess = false, lastWord = false } = {}) => {
    const p = document.createElement('p');
    const chat = document.createTextNode(`${message}`);
    const messages = document.querySelector('.messages');
    if (name !== '') {
        const span = document.createElement('span');
        span.textContent = `${name}: `;
        span.classList.add('fw-bold');
        p.append(span);
    }
    p.classList.add('p-2', 'mb-0');
    if (closeGuess) p.classList.add('close');
    if (lastWord) p.classList.add('alert-warning');
    if (correctGuess) {
        document.getElementById(`skribblr-${id}`).classList.add('correct');
        p.classList.add('correct');
    }
    p.append(chat);
    messages.appendChild(p);
    messages.scrollTop = messages.scrollHeight;
    if (message === 'You guessed it right!') correct.play();
};

const sendMessage = (e) => {
    e.preventDefault();
    const message = document.querySelector('#sendMessage input').value;
    document.querySelector('#sendMessage input').value = '';
    socket.emit('message', { message });
};

socket.on('getPlayers', createScoreCard);
socket.on('choosing', ({ name }) => {
    const p = document.createElement('p');
    p.textContent = `${name} is choosing a word`;
    p.classList.add('lead', 'fw-bold', 'mb-0');
    document.querySelector('#wordDiv').innerHTML = '';
    document.querySelector('#wordDiv').append(p);
    document.querySelector('#clock').textContent = 0;
    clearInterval(timerID);
    clock.stop();
});

socket.on('hints', (data) => { hints = data; });

socket.on('hideWord', ({ word }) => {
    const p = document.createElement('p');
    p.textContent = word;
    p.classList.add('lead', 'fw-bold', 'mb-0');
    p.style.letterSpacing = '0.5em';
    document.querySelector('#wordDiv').innerHTML = '';
    document.querySelector('#wordDiv').append(p);
});

socket.on('startTimer', ({ time }) => startTimer(time));
socket.on('message', appendMessage);
socket.on('closeGuess', (data) => appendMessage(data, { closeGuess: true }));
socket.on('correctGuess', (data) => appendMessage(data, { correctGuess: true }));
socket.on('lastWord', ({ word }) => appendMessage({ message: `The word was ${word}` }, { lastWord: true }));

socket.on('updateScore', ({
    playerID,
    score,
    drawerID,
    drawerScore,
}) => {
    document.querySelector(`#skribblr-${playerID}>div p:last-child`).textContent = `Score: ${score}`;
    document.querySelector(`#skribblr-${drawerID}>div p:last-child`).textContent = `Score: ${drawerScore}`;
});

socket.on('endGame', async ({ stats }) => {
    let players = Object.keys(stats).filter((val) => val.length === 20);
    players = players.sort((id1, id2) => stats[id2].score - stats[id1].score);

    clearInterval(timerID);
    document.querySelector('#clock').textContent = 0;
    await animateCSS('#gameZone', 'fadeOutLeft');
    document.querySelector('#gameZone').remove();

    players.forEach((playerID) => {
        const row = document.createElement('div');
        const nameDiv = document.createElement('div');
        const scoreDiv = document.createElement('div');
        const name = document.createElement('p');
        const score = document.createElement('p');

        name.textContent = stats[playerID].name;
        score.textContent = stats[playerID].score;

        row.classList.add('row', 'mx-0', 'align-items-center');
        nameDiv.classList.add('col-7', 'text-center');
        scoreDiv.classList.add('col-3', 'text-center');
        name.classList.add('display-6', 'fw-normal', 'mb-0');
        score.classList.add('display-6', 'fw-normal', 'mb-0');

        nameDiv.append(name);
        scoreDiv.append(score);
        row.append(imgDiv, nameDiv, scoreDiv);
        document.querySelector('#statsDiv').append(row, document.createElement('hr'));
    });
    clock.stop();
    gameOver.play();
    document.querySelector('#gameEnded').classList.remove('d-none');
    animateCSS('#gameEnded>div', 'fadeInRight');
});

document.querySelector('#sendMessage').addEventListener('submit', sendMessage);


//--------------------------------------------------------- Games

const leven = require('leven');
const GraphemeSplitter = require('grapheme-splitter');
const {
    get3Words,
    getScore,
    wait,
    getHints,
} = require('./helpers');

let splitter = new GraphemeSplitter();

class Games {
    constructor(io, socket) {
        this.io = io;
        this.socket = socket;
    }

    chosenWord(playerID) {
        const { io } = this;
        return new Promise((resolve, reject) => {
            function rejection(err) { reject(err); }
            const socket = io.of('/').sockets.get(playerID);
            socket.on('chooseWord', ({ word }) => {
                socket.to(socket.roomID).emit('hideWord', { word: splitter.splitGraphemes(word).map((char) => (char !== ' ' ? '_' : char)).join('') });
                socket.removeListener('disconnect', rejection);
                resolve(word);
            });
            socket.once('disconnect', rejection);
        });
    }

    resetGuessedFlag(players) {
        const { io } = this;
        players.forEach((playerID) => {
            const player = io.of('/').sockets.get(playerID);
            if (player) player.hasGuessed = false;
        });
    }

    async startGame() {
        const { io, socket } = this;
        const { rounds } = games[socket.roomID];
        const players = Array.from(await io.in(socket.roomID).allSockets());
        socket.to(socket.roomID).emit('startGame');
        for (let j = 0; j < rounds; j++) {
            for (let i = 0; i < players.length; i++) {
                await this.giveTurnTo(players, i);
            }
        }
        io.to(socket.roomID).emit('endGame', { stats: games[socket.roomID] });
        delete games[socket.roomID];
    }

    async giveTurnTo(players, i) {
        const { io, socket } = this;
        const { roomID } = socket;
        const { time } = games[roomID];
        const player = players[i];
        const prevPlayer = players[(i - 1 + players.length) % players.length];
        const drawer = io.of('/').sockets.get(player);
        if (!drawer || !games[roomID]) return;
        this.resetGuessedFlag(players);
        games[roomID].totalGuesses = 0;
        games[roomID].currentWord = '';
        games[roomID].drawer = player;
        io.to(prevPlayer).emit('disableCanvas');
        drawer.to(roomID).broadcast.emit('choosing', { name: drawer.player.name });
        io.to(player).emit('chooseWord', get3Words(roomID));
        try {
            const word = await this.chosenWord(player);
            games[roomID].currentWord = word;
            io.to(roomID).emit('clearCanvas');
            drawer.to(roomID).broadcast.emit('hints', getHints(word, roomID));
            games[roomID].startTime = Date.now() / 1000;
            io.to(roomID).emit('startTimer', { time });
            if (await wait(roomID, drawer, time)) drawer.to(roomID).broadcast.emit('lastWord', { word });
        } catch (error) {
            console.log(error);
        }
    }

    onMessage(data) {
        const { io, socket } = this;
        const guess = data.message.toLowerCase().trim();
        if (guess === '') return;
        const currentWord = games[socket.roomID].currentWord.toLowerCase();
        const distance = leven(guess, currentWord);
        if (distance === 0 && currentWord !== '') {
            socket.emit('message', { ...data, name: socket.player.name });
            if (games[socket.roomID].drawer !== socket.id && !socket.hasGuessed) {
                const drawer = io.of('/').sockets.get(games[socket.roomID].drawer);
                const { startTime } = games[socket.roomID];
                const roundTime = games[socket.roomID].time;
                const roomSize = io.sockets.adapter.rooms.get(socket.roomID).size;
                socket.emit('correctGuess', { message: 'You guessed it right!', id: socket.id });
                socket.broadcast.emit('correctGuess', { message: `${socket.player.name} has guessed the word!`, id: socket.id });
                games[socket.roomID].totalGuesses++;
                games[socket.roomID][socket.id].score += getScore(startTime, roundTime);
                games[socket.roomID][drawer.id].score += BONUS;
                io.in(socket.roomID).emit('updateScore', {
                    playerID: socket.id,
                    score: games[socket.roomID][socket.id].score,
                    drawerID: drawer.id,
                    drawerScore: games[socket.roomID][drawer.id].score,
                });
                if (games[socket.roomID].totalGuesses === roomSize - 1) {
                    round.emit('everybodyGuessed', { roomID: socket.roomID });
                }
            }
            socket.hasGuessed = true;
        } else if (distance < 3 && currentWord !== '') {
            io.in(socket.roomID).emit('message', { ...data, name: socket.player.name });
            if (games[socket.roomID].drawer !== socket.id && !socket.hasGuessed) socket.emit('closeGuess', { message: 'That was very close!' });
        } else {
            io.in(socket.roomID).emit('message', { ...data, name: socket.player.name });
        }
    }

    async getAllPlayers() {
        const { io, socket } = this;
        const players = Array.from(await io.in(socket.roomID).allSockets());
        io.in(socket.roomID).emit('getPlayers',
            players.reduce((acc, id) => {
                const { player } = io.of('/').sockets.get(id);
                acc.push(player);
                return acc;
            }, []));
    }
}

module.exports = Games;

//--------------------------------------- helpers

const { readFileSync } = require('fs');
const Chance = require('chance');
const GraphemeSplitter = require('grapheme-splitter');

const chance = new Chance();
let splitter = new GraphemeSplitter();
const words = JSON.parse(readFileSync('----------------------').toString('utf-8'));

const getScoreNow = (startTime, roundtime) => {
    const now = Date.now() / 1000;
    const elapsedTime = now - startTime;
    const roundTime = roundtime / 1000;
    return Math.floor(((roundTime - elapsedTime) / roundTime) * MAX_POINTS);
}

const populateDisplayTime = (hints, roomID) => {
    const roundTime = games[roomID].time;
    const startTime = Math.floor(roundTime / 2);
    const hintInterval = Math.floor(startTime / hints.length);
    return hints.map((hint, i) => ({
        hint,
        displayTime: Math.floor((startTime - (i * hintInterval)) / 1000),
    }));
}

const getHints = (word, roomID) => {
    let hints = [];
    const wordLength = splitter.countGraphemes(word);
    const hintsCount = Math.floor(0.7 * wordLength);
    const graphemes = splitter.splitGraphemes(word);
    let prevHint = graphemes.map((char) => (char !== ' ' ? '_' : ' '));
    while (hints.length !== hintsCount) {
        const pos = chance.integer({ min: 0, max: wordLength - 1 });
        if (prevHint[pos] !== '_') continue;
        prevHint = [...prevHint.slice(0, pos), graphemes[pos], ...prevHint.slice(pos + 1)];
        hints.push(prevHint);
    }
    hints = hints.map((hint) => hint.join(''));
    return populateDisplayTime(hints, roomID);
}

const wait = (roomID, drawer, ms) => {
    return new Promise((resolve, reject) => {
        round.on('everybodyGuessed', ({ roomID: callerRoomID }) => {
            if (callerRoomID === roomID) resolve();
        });
        drawer.on('disconnect', (err) => reject(err));
        setTimeout(() => resolve(true), ms);
    });
}

const getNumberOfPlayers = (roomID) => {
    return Object.keys(games[roomID]).filter((key) => key.length === 20).length;
}

module.exports = {
    getScoreNow,
    getHints,
    wait,
    getNumberOfPlayers,
};

//--------------------------------------------------- Room

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
