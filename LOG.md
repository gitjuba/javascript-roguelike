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

Let's fix the scope of this project. I'll make a Roguelike. Rename the repository to `javascript-roguelike`:

- Create new repo in GitHub
- Add new repo as remote: `git remote add newremote git@github.com:gitjuba/javascript-roguelike.git`
- Push history to new remote: `git push -u newremote master`
- Remove old remote: `git remote remove origin`
- Rename new remote as `origin`: `git remote rename newremote origin`
- Rename local folder

Then, let's talk ASCII. As a fan of the old Roguelikes, I want to use [Code page 437](https://en.wikipedia.org/wiki/Code_page_437) font. And the "terminal" size should of course be 80 by 24 characters.

Or maybe [Code page 850](https://en.wikipedia.org/wiki/Code_page_850)?

How do I use that font? Do I download the Wikipedia image and use it as a "sprite sheet"?

## 2021-03-16

Downloaded the Code page 850 character set image from Wikipedia. It seems to be decent resolution, the symbols are colored `#aaaaaa`. I'll worry about different colors later, now let's try to load the image and render something on screen, using (as the first choice which came to mind) the HTML canvas `drawImage` method, one method call for each tile.

What's the minimal way to load an image? I don't want to introduce complicated asset loading logic, and the image is just a few kilobytes.

Converted it to Base64 and created an image element inline in the main HTML file.

```js
var img = fs.readFileSync('./Codepage-850.png')
var img_b64 = Buffer.from(img).toString('base64')
```

The game renderer extracts individual 9-by-14 pixel characters from this image.

Next, make the screen 80 by 24 characters large, with the characters drawn in one-to-one resolution, i.e. 9 by 14 pixels.

It's too small, let's scale it up by 2 (integer number) with CSS transform. To get pixel-perfect upscaling, add `image-rendering: optimizespeed` to the canvas elements. Might also need to translate using pixel units instead of percentages.

Hmm, is Code page 850 font (9 by 14 px) really used with 80 by 24 terminals? The screen looks so wide... The code page 437 symbols seem to be a bit taller (one pixel?), might give that a try later. But if it's too wide I could
