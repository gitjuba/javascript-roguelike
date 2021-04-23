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

Converted it to Base64 and created an image element inline in the main HTML file. In NodeJS:

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

Well then, _line of sight_... We have to define visibility.

Let `(x, y)` and `(x0, y0)` be two points in the plane with integer coordinates, and assume `x > x0` and `y > y0` (so that a line from `(x0, y0)` to `(x, y)` is in the first quandrant in a coordinate system fixed at `(x0, y0)`). Furthermore, assume that `y - y0 <= x - x0` (meaning that the joining line has slope at most 45 degrees).

Let `m = (y - y0) / (x - x0)` be the slope of the line joining the two points. For each `j` in `[1, ..., x - x0 - 1]`, let `(xj, yj)` be the point `(x0 + j, y0 + m * j)`. We say that the point `(xj, yj)` _blocks the line_ from `(x0, y0)` to `(x, y)` in the current level, if either of the following holds:

1. `yj` is an integer, and the current level has an obstacle (wall) at `(xj, yj)`
2. `yj` is not an integer, and the current level has obstacles at `(xj, int(yj))` and `(xj, int(yj) + 1)`, where `int(y)` is the integer part of `y`

We say that the point `(x, y)` is _visible_ from `(x0, y0)`, if there are no points which block the line between them.

Hmm, maybe the second condition is too strict. We could combine the conditions to

3. the current level has an obstacle at `(xj, round(yj))`, where `round(y)` is the nearest integer to `y`

This condition may not be strict enough... How about

4. the current level has an obstacle at `(xj, round(yj))` _and_ `abs(yj - round(yj)) <= c`, where `c` is some constant between zero and 0.5.

## 2021-03-24

Make a map with more features, to test the line of sight.

Bug: You can still hit the monster even if it's dead and not shown on screen.

## 2021-04-17

Implementing visibility. It seems all the definitions given above are a bit flawed. With condition 2, a single wall tile can block lines only along a cardinal direction. With condition 3, the bottom-right tile in the pic below is not visible.

```
@..
.##
```

Condition 4 is equivalent to 3 if `c = 0.5`. If `c < 0.5`, the bottom-right tile in the pic below _is_ visible.

```
@##
.##
```

So we need a combination of 2 and 4. So, `(xj, yj)` _blocks the line_ between `(x0, y0)` and `(x, y)` if

- the current level has an obstacle at `(xj, round(yj))` and `abs(yj - round(yj)) <= c`

_or_

- the current level has obstacles at `(xj, int(yj))` and `(xj, int(yj) + 1)`

Looks pretty good.

Now, generalize the definition of visibility to cases where `(x, y)` is in a different angle from `(x0, y0)`. Generalizing to angles -45 to 45 degrees is straightforward, just drop the requirement `y > y0`, and require `abs(y - y0) <= x - x0`. The definition needs not be changed.

## 2021-04-18

Problem: with the above definition, the rightmost three wall tiles in the below image are not visible.

```
@.....
######
```

Possible solution: Make the constant `c` in the definition depend on the tile to which visibility is calculated. For wall tiles this constant would be very low, something like 0.05, for empty space closer to 0.5, something like 0.45. Seems to solve it.

Back to generalizing the definition of visibility in other directions. For the ranges of angles 135...180 and -180...-135 it's again straightforward: just choose the points `(xj, yj)` (choose the increment in `j`) according to the sign of `x - x0`.

For the case `abs(y - y0) > abs(x - x0)` a similar definition can be made, just put `m = (x - x0) / (y - y0)` and `yj = y0 + j`, `xj = x0 + m * j`

## 2021-04-19

Continuing the above, the implementation is simple enough, might wanna DRY it out at some point. But, there's a problem: wall tiles are "seen" through single tile wide walls.

## 2021-04-20

We need a different definition of visibility, one that formulates the _visible portion_ of a tile in a way that tiles blocking line of sight from different directions would add up and block the line of sight completely. With the above notation (and slightly rephrased terminology), we say that, for each `j` in `[0, ..., x - x0 - 1]` the _blocked visible portion at distance `j`_ is `vj_ * (1 - abs(yj - int(yj))) + vj^ * (1 - abs(yj - (int(yj) + 1)))`, where `vj_` equals one if the level has an obstacle at `(xj, int(yj))`, and zero otherwise, and `vj^` equals one if the level has an obstacle at `(xj, int(yj) + 1)`, and zero otherwise.

The _total blocked visible portion_ between `(x0, y0)` and `(x, y)` is the sum of the blocked visible portions at all distances `j`.

No no no, we have to differentiate between _left visibility_ and _right visibility_, or, more generally, _rounded down visibility_ and _rounded up visibility_. So, the _blocked rounded down portion at distance `j`_ is `vj_ * (1 - abs(yj - int(yj)))`, and the _blocked rounded up portion at distance `j`_ is `vj^ * (1 - abs(yj - (int(yj) + 1)))`. Then, for both sides, the total blocked portion is the _maximum_ of the blocked portions at all distances, and the full total blocked portion is the sum of these two maxima.

Let's try it.

Side note, `j` can start at one (`j = 0` gives us `(x0, y0)`, which is trivially visible).

Hey, seems to work!

## 2021-04-21

There are still some annoying artefacts with the current visibility algorithm, but let's leave it as it is for now, and focus on the remaining items in the _Goal II_ checklist.

## 2021-04-22

Let's do colors. How can I combine visibility with colors? Do I _need_ to do that? Perhaps only empty space needs to be colored differently based on whether or not it is visible to the player. On the other hand, I might want to have empty space of different colors (dungeon floor, grass, ...).

Let's review the different canvases in use in the map (ignoring stats and log for now, although they could use some coloring, too, at some point). Ignoring also the debug canvas. The order at the moment is

1. Color
1. Level
1. Seen
1. Objects

If you think about it, the order should in fact be

1. Color
1. Level
1. Objects
1. Seen

And we'll need a new canvas to show the visible portion of the level map. The idea is to blend the colors in the color canvas and visibility canvas to produce a brighter color on the visible tiles. So the new order would be

1. Color
1. Visiblity
1. Level
1. Objects
1. Seen

How to blend colors? Let's make a new HTML file to test it. The opacity of what is drawn on the canvas can be controlled by setting the fill style as an `rgba` quadruplet, e.g. `ctx.fillStyle = rgba(255, 0, 0, 0.5)` for semi-transparent red.

Ok, let's handle the visibility by dimming out the squares which are not visible.

Another option would be to specify two colors for each tile type, one for when the tile is visible and another for when it isn't. But I don't want to mix the color and visibility too much. Having a separate visiblity layer allows to draw the level and its color canvas only once (whenever the level is altered).

Anyway, we have to specify tile colors. Let's have the tile symbol define it for now, later it might be different per level.

Note that object colors are handled in the object canvas.

Wow, I made a cool effect by accident: Repeatedly drawing rectangles with `rgba(0, 0, 0, 0.1)` on the canvas slowly fades the level map to black. This could be used at some point. But, at the moment, we only want to draw the dimming rectangle once, when the tile first becomes not visible. Let's make an array `wasVisible`.

Seems to work. Getting some serious ADOM vibes here... Anyway, _colors_ can be considered done.

Side note: Prettier formats inline JS in HTML files quite bizarrely...

---

Next goal post is a big one: _aggressive monsters_. Break it down to more simple improvements:

- Multiple monsters
  - With individual stats, hit percentages, symbols and so forth
- Monsters chase the player and attack when adjacent
  - Don't try to make any sophisticated route finding algorithms, monsters simply move in the direction which minimizes distance to player.
  - Are all monsters aggressive all the time? Let's make it so that each monster has some chance to become aggressive each turn if the player is too close (and the player sees them, assuming here that the player has the largest sight radius)).
  - Once aggressive, monsters never cool down, and whenever seen, chase the player
  - Having individual sight radii for all monsters might make it too complicated
- The player can die.

Let's start with multiple monsters. Player and monster movement needs to take into account all other monsters. This calls for some abstraction, and treating all objects (with x and y coordinates) in a more unified manner.

Hmm, let's create an `isOccupied` array, and update it whenever an object (player or monster) moves. It could also check the tile map, put false for walls.

## 2021-04-23

Let's do diagonal movement. I want this to be playable on a laptop with no separate numpad, so movement is made with keys `uiojklm,.`. Later when we add more commands, movement keys can be toggled on/off with, say, _Tab_.

Player only first. Also enable attacking diagonally.

Write a helper function which takes two objects with X and Y coordinates, and computes a list of preferred approach directions from one to another.

Side note, this is a weird combination of `l_2` and `l_max` metrics.

Writing a game calls for better debugging capabilities than `console.log`...

Then, make the monsters actually attack.

When there are multiple monsters attacking, the log messages in one turn may span several lines. Also, if there are even more monsters, the five line log buffer may be completely filled. First of all, break each log message into chunks of at most line length (break at whitespace). Basically we want to separate the log buffer (list of messages) from the log buffer display (five lines).
