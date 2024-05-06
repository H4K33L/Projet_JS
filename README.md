Welcome to the Skrybe.io project.

## The Project
This project is built on an Express app. If you're unfamiliar with how an Express app works:
- **bin/www**: This file represents the server side.
- **app.js**: This script manages webpage redirection based on router rules.
- **routes/**: This directory contains all the router functions.
- **views/**: Here, you'll find the `.pug` documents which are used to create web pages.
- **public/**
  - **images/**: Store images used on the website.
  - **javascript/**: Contains client-side JavaScript code.
  - **stylesheets/**: Houses CSS scripts used in the website.

The site has two main pages:
1. **Connection Page**: Users choose their username and the room to join. If the room doesn't exist, it is created.
2. **Game Page**: Once all players are on this page, one of them can click the "GO" button to start the game.

## Game Rules
The game follows rules similar to Skribbl.io:
- One player receives a word and must draw it to help other users guess the word.
- Users earn points based on their performance and position; for example, guessing the word first earns maximum points.
