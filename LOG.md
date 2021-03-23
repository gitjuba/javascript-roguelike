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

Hmm, is Code page 850 font (9 by 14 px) really used with 80 by 24 terminals? The screen looks so wide... The code page 437 symbols seem to be a bit taller (one pixel?), might give that a try later. But if it's too wide I could draw the player stats overlay on the right or left side of the screen, instead of the ADOM style bottom.

Next up, player stats. Let's draw them on yet another canvas element (as they change even less than the level map). Let's make a side panel 10 characters wide (that'll limit player name length but that's ok...).

I should probably start with a helper function for rendering text at given row/column.

Alright, then let's make a fight! There are some design questions to address, here. Do I want a separate key for attacking or attack just by moving towards the enemy? I'll go with the former approach. Pressing _a_ toggles a flag which says the player is attacking, and with that flag up, only arrow keys yield something.

We need some turn logic. Set up a flag `turnDone` which is toggled on

- successful motion (moving against wall or monster does nothing?)
- a "resolved" attack (may attack empty space to make "void" attack)

I need a log system, for showing game messages on screen. In ADOM the event log is shown on the top of the screen. Side note: ADOM screen was 80 by 25, of which 80 by 20 tiles showed the map. If I make the screen also 25 characters tall, I'll have 70x25 for the map. Can I fit the log in the side bar? Nah, that's too narrow. I could put it in the bottom. How may rows? I could show some log buffer. Five rows?

How to format the log? Put a `>` in the beginning of each line. When an event (player or monster attacking) generates a log message, push it to a buffer which is five lines long.

Or rather, the log can (for the moment) contain the whole game, but we only show five most recent entries.

## 2021-03-17

Next goal would be line of sight, and, somewhat related to that, a visibility radius around the character.

Line of sight feels like a more difficult problem, so let's start with the visibility radius. So tiles within a given distance from the player are _visible_ (whether or not behind obstacles or deep within a wall). Tiles which have at some point been _visible_ are _seen_.

## 2021-03-18

How to implement visible and seen tiles?

- Draw the whole map on one canvas
- Draw a _seen_ mask on another canvas, which at start is all black
- Whenever the player moves, mark tiles within a given distance from the player as visible, and clear these tiles on the seen mask
- Monsters are shown only if on visible tiles.

I could think of some ways to optimise this. Keep track of the coordinates of the tiles on the edge (border) of the visibility circle, and update these coordinates together with the player coords.

Or update the seen and visible flags to separate arrays, same size as the level map, and update those as the player moves.

Not sure if these are at all necessary optimizations (don't think so...) but it feels so wasteful to loop over the whole map when we know the exact difference between the currently and previously visible tiles.

For the line of sight, we'll first need to somehow highlight the visible portion of the map. So that's where colors come into play.

## 2021-03-22

How to color the tiles? Let's try converting the character color to transparent in Gimp (_Colors >> Color to alpha..._) and replace the `chars` image element with that.

Seems to work, now the character `@` is invisible because the mostly black `.` tiles show through.

To test it out, draw a colored rectangle "under" the player and monster.

Problem: Log and stats are not shown. Should I have two character sheets, one for transparent characters and one for areas which don't need coloring?

If the base level map were opaque, there should be another layer of level tiles to indicate the visibility circle. So let's make the base map transparent, and under everything, draw a _color_ canvas which is some shade of grey in seen areas and bright white in visible area. These color tiles then have to be updated when the player moves. Note that this also supports coloring e.g. walls differently than walkable area.

## 2021-03-23
