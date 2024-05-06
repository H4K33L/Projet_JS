Welcome to the Skrybe io project.

#--- The project ---#
The project is build on an exepress app, if you dont know how an express app work :
 - bin/www : is the server side.
 - app.js : this is the script who redirect webpage link folowing the router rules.
 - routes/ : this is the place where all router function are place.
 - views/ : this is the place where you place .pug documents. We used pug to make web pages.
 - public/
   - images/ : this is the place where you place iamges used in the website.
   - javascript/ : this is the place where you place javascript code used in the website, the client side is place here.
   - stylesheets/ : this is the place where you place CSS script used in the website.

There is two page in the site, the conection page where the user chose his username and the room to join.
If the romm dosent exist the room are create.
And the second page is the game page. Once all the player are on the game page one of them can clic on the GO button to launch the game.

#--- Games rules ---#
The rules of the game is like the Skribbl io game, but if you did'nt know it :
One of the player recive a word and he need to draw to help the other user gues the word.
User get point depending on her position, all the point if he gues the word first ect ect.
