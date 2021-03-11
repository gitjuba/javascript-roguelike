# Development log

## 2021-02-14

Started project, no idea what this will become.

Created NPM project, added eslint and prettier.

I could make a roguelike. That's something I've always wanted to make. Or a hybrid of text adventure and tile based adventure. Or some resource management game.

The starting point could anyway be a two-dimensional tile map. So make a canvas and create animation loop.

Write FPS as debug text in upper left corner.

Then, render a map on screen. First implementations always minimal, so write the map inline in the script file. Agree on tile dimensions (canvas width and height should be divisible).

Drew tile borders using canvas moveTo and lineTo, the page became unbearably slow, started to use 100% CPU. Drawing the borders with strokeRect also uses a lot, but "only" about 50%.

[Here](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas) are some useful tips to optimize `<canvas>` performance. At least the idea of drawing the background on a separate canvas seems reasonable for my use case.

Before optimizing too much, let's get a player character on screen and moving. Let's force player movement to the tiles, i.e. jump from one tile to the next, no continuous motion. This is done by listening to keyup events.

## 2021-03-11

Tile map is indexed "rows first", i.e. the element `tileMap[i][j]` maps to the tile on row `i`, column `j`. Contrast this with player coordinates, represented as `(x, y)`, so moving the player in the horizontal direction corresponds to changing the `j` coordinate on the tile map and vice versa.

It's a bit annoying to see 50% resource consumption with a trivial _non-game_, so let's optimize anyway.

Three basic methods:

- Drawing only the parts of the canvas which have been changed
- Drawing the background/scene on one canvas and the "more dynamic" entities (i.e. player, monsters, moving obstacles) on another
- Redraw canvas only when something has changed

Not sure if the first can easily be done without the second. And neither of the first two would make any sense without the third. So let's start with the second and third.

To make the objects canvas transparent, it has to be cleared in the start of the frame with `ctx.clearRect()` instead of `ctx.fillRect()` with `fillStyle('white')`

As simple as possible: Add a hook to the `keyup` events which toggles a flag `redrawObjects` when the player moves. Also introduce a flag `redrawLevel` which, for the moment is set to true only in the beginning.

Ended up separating the debug overlay to a canvas of its own, too. Now it doesn't hog that much resources.
