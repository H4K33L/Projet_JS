const { readFileSync } = require('fs');
const Chance = require('chance');
const GraphemeSplitter = require('grapheme-splitter');

const chance = new Chance();
const splitter = new GraphemeSplitter();
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
