Shooty game
=======

About the challenge
---
I developed this game as part of my "build one HTML5 game a week" challenge. I build a new game every week, and release the source code to it. I hope to get better at game development, and I hope that it will be useful to you too.

If you're interested in learning more about this, visit <http://www.burningtomato.com>. I publish all the games I build on that website. You can also follow me on Twitter at <https://twitter.com/burningtomato>.

About the game
---
This game is a side-scrolling shooter. You have to shoot the enemies. They're bad people and you're very cross with them because they stole your wife and ruined Christmas.

Map data was generated using Tiled then manually modified.

Building the source code
---
You will need NodeJS and the Grunt CLI to build the source code.

1. Clone the git repository `git clone` to a new directory
2. Install the NodeJS dependencies by issuing the `npm install` command in a terminal
3. Compile the source code by issuing the `grunt` command in a terminal

Some side notes:

- Make sure you serve the files from a http:// address rather than a files:// address. Due to some security policies things may not work correctly otherwise.
- If you use an IDE, be sure to set up a file watcher so Grunt is ran automatically when you make changes. It'll make your life a lot easier.
- Your browser needs to have support for HTML5 and Canvas, obviously.

License
---
This game, and all my other games developed as part of this challenge, are available under the MIT license.

See the included LICENSE file for details.