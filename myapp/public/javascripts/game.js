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