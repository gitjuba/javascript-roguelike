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

---

Next goal is the biggest one yet: random dungeon levels.

## 2021-04-24

Didn't have an implementation idea for random levels right away so I watched a couple of tutorials on procedural level generation. Probably the simplest method is to place rectangles on the screen at random (in such a way that they don't overlap), and connect them (in random order?) with corridors. More detail:

1. Sample the width `w` and height `h` of the room from uniform distributions over `[w0, ..., w1]` and `[h0, ..., h1]` where `w0` and `w1` are, respectively, the minimum and maximum room _width_, and `h0` and `h1` are the minimum and maximum room _height_.
2. Assuming the map spans the tiles `[0, ..., W - 1] x [0, ..., H - 1]`, sample the coordinates of the top left corner of the room from uniform distributions `[1, W - 1 - w]` and `[1, H - 1 - h]`

- We require that the outermost tiles are always walls.

3. Loop over already placed rooms. If the new room overlaps some of them, go back to step 1.

- Re-sample the size too? A smaller room might have better chances of fitting.

4. If there are no overlaps, place the new room.

Stop placing rooms when either of the following conditions are satisfied:

- The percentage of floor tiles is above some threshold

or

- Step 3. above has failed enough times.

Then, how to place the corridors? First, pick two rooms and connect them with a corridor. Then, as long as there are unconnected rooms remaining, pick one unconnected room and one connected room, and connect them with a corridor.

1. Pick two rooms, `j` and `k` at random, pick points within these rooms, `p_j = (x_j, y_j)` and `p_k = (x_k, y_k)` at random.
2. Pick one of the points `(x_k, y_j)` and `(x_j, y_k)` (turning point of the corridor) at random and call it `p_jk`. **Note** this point will coincide with one of the points within the rooms if `x_j == x_k` or `y_j == y_k`.
3. A _corridor_ between the rooms `j` and `k` is defined as the triplet `[p_j, p_jk, p_k]`. The pair `[p_j, p_jk]` is called the first leg of the corridor and `[p_jk, p_k]` the second leg.
4. Two rooms `j` and `k` are called _connected_ if there exists a chain of rooms `i_1,...,i_r` where `i_1 == j` and `i_r == k` and for each pair `(i_q, i_q+1)` there exists a corridor between them.
5. Loop over the remaining rooms and check if either of the legs of the corridor between rooms `j` and `k` overlaps with the room. If, say, room `i` overlaps with the corridor, pick a point `p_i` within the intersection.
6. If the first leg overlaps, then `[p_j, p_i, p_i]` forms a corridor between `j` and `i` and `[p_i, p_jk, p_k]` forms a corridor between `i` and `k`, and if the second leg overlaps, `[p_j, p_jk, p_i]` is a corridor between `j` and `i` and `[p_i, p_i, p_k]` between `i` and `k`.

## 2021-04-30

For convenience, each corridor can be represented as two rooms.

Alright, a basically working level generator is done. Now, how to hook it up with the rest of the game?

It's a bit annoying to have a corridor run right next to a room. But that and other issues can wait further developments.

A level can be defined simply as a list of rooms (with corridors interpreted as rooms, too). As a first test, generate the level in that form and immediately draw the tile map.

We have to differentiate between rooms and corridors because the player starting position (and stairs etc) has to be in a room, as it traditionally is.

It works! This is kinda cool already. Surely we're not far from a complete game. Surely.

On to the next challenge: multiple levels!

## 2021-05-01

First, let's make two levels with staircases connecting them.

- Staircase up is `<`, doẁn `>`, as in ADOM.
- For the moment, allow only one upwards staircase and one downwards, i.e. no branching dungeons.
- We have an array of level maps (collections of rooms and corridors), and a pointer to that array denoting the current level
- When player enters a staircase, raise a flag `levelChanged` and, when redrawing level, recreate tile map from new level map

We need to store the "seen" mask values per level, and also the monsters, and the "occupied" mask.

---

Some high level goals and/or visions, for the far future, i.e. _What makes this game unique?_

- Sprawling dungeons: A dungeon level could extend to the sides as well as up and down
  - This could be represented as a two-dimensional map using ASCII, see below
  - One probably can't extend one dungeon level to all four directions.

```
-----------
| Level 1 |
-----------
     |_________________
     |                 |
------------     ------------      ------------
| Level 2a |     | Level 2b |------| Level 2c |
------------     ------------      ------------
```

- Resource management
  - Yes, that's right. Resource management.
  - I've had the idea for a long time of a resource management / city builder game where, instead of assuming the role of an all-seeing controller, the player is a single character in the world, who, in particular, can be in only one place at a time. They would have to rely on NPC's to control most of the cities/factories/mines etc and their production when they are busy dungeoneering or something.
  - No idea yet how this will in practice be implemented. Or what those resources would be used for.

## 2021-05-07/08/09

The project needs some refactoring and probably better tooling. Jot down some notes below.

Tools:

- Exclude this file from Prettier automatic formatting on save (the Prettier plugin is kind of slow so formatting a 400 line MarkDown file takes some time, and this doesn't really need to be autoformatted).
- Let's try to use VS Code for better debugging capabilities
  - `sudo pacman -S code`
- I feel like ST3 suits better for writing notes though. I guess that sentiment might change once I get more familiar with VSCode. Seems there are no conflicts editing files in both editors.

Game:

What does a _level_ consist of?

- Level layout or blueprint, i.e. placement of rooms and corridors, and staircases/exits
  - For the moment, only staircases leading either up or down.
  - First level also has player starting point (or is it set on the fly?)
- Level map, a.k.a. tile map (is this needed? could be generated when the level is entered)
- _Seen_ mask, a boolean mask marking the tiles which the player has seen
- Monsters (coordinates and stats)
- Later on, items (coords and stats)

Rethink the game loop.

- On the first turn the player enters a new level.
  - Generate level blueprint. Put it as the first element of the dungeon levels list.
  - Set player position (at random) in first level.
  - Create level tile map.

## 2021-08-12/13

Back where I left off: Updating the editor to VSCode for better debugging. So, let's launch VSCode and open the project folder.

How to debug the game? Need to select a debug environment (browser(Chrome)/NodeJS)

Hmm, didn't have Chrome installed. It's not available in the Arch Linux package repository, but it is in AUR. So install it.

Installed Chrome from AUR. Pressing _Launch Chrome against localhost_ opens up Chrome but fails to reach `http://localhost:8080/`. In the debug console it says

```
crbug/1173575, non-JS module files deprecated.
```

I stopped the session, Chrome was closed, but when I tried again, it complains "a browser is already running from an old debug session". Chose _Debug anyway_, Chrome started with complaint "Chrome didn't shut down properly, restore session?" and again failed to connect to localhost.

Tried using `request: "attach"` instead of `"launch"`, complaint "Could not find any debuggable target".

So VSCode does not launch a web server to serve the HTML files, even with the "launch" debug config? Let's read the tutorial article _in alle Ruhe_.

> The best way to explain the difference between launch and attach is to think of a launch configuration as a recipe for how to start your app in debug mode before VS Code attaches to it, while an attach configuration is a recipe for how to connect VS Code's debugger to an app or process that's already running.

I guess _launching_ is more for NodeJS (server) apps, whereas _attaching_ is more for web apps (which can use stuff like Webpack which VSCode doesn't know about). So I'll have to run a NodeJS (e.g. Express) app to serve the files.

Or maybe VSCode has some extension which does that.

Hmm, for the moment just run a dummy Python web server in the project folder: `python -m http.server`, which starts a server in `http://localhost:8000`. Then in VSCode, create a launch configuration

```json
{
    "type": "pwa-chrome",
    "request": "launch",
    "name": "Launch Chrome against localhost",
    "url": "http://localhost:8000",
    "webRoot": "${workspaceFolder}"
}
```

## 2021-08-14

The code feels too tangled to do anything. Let's rewrite the main business logic in a separate file.

But first, configure VSCode editor.

- Tab width. Can I use an `.editorconfig` file? Using EditorConfig requires a plugin, but I'll happily install that. I'll also install it for Sublime Text.
  - Had issue with extensions marketplace (unable to connect). Found (temporary) solution online: https://github.com/VSCodium/vscodium/issues/746#issuecomment-881049046
    - So add the line `"enable-browser-code-loading": false` to `~/.vscode/argv.json` and restart VSCode.
  - Right-click the workspace in the _Explorer_ view, and choose _Generage .editorconfig_. A file is generated with mostly OK settings.
- Autosave files on focus change: Open settings and search for "autosave"

In a turn-based game one does not have to update game state in every frame. Instead, event listeners are registered to get user input independently from the animation loop (e.g. keyboard controlled games listening to _keyup_ events). And those two should be clearly separated, because, a priori, user inputs and the animation frame cycle can occur at the same time. So when handling user input we have to raise a flag indicating that the game state has changed, and that flag needs to be raised after the input is completely processed.

So on the highest level it looks like this:

```js
function Game() {
  this.updateState = function(event) { }
  this.render = function() {}
}

var game = new Game();

function gameLoop() {
  game.render()
  window.requestAnimationFrame(gameLoop)
}

window.addEventListener('keyup', function(e) {
  game.updateState(e)
})

window.requestAnimationFrame(gameLoop)
```

Are there some global level objects needed? The HTML canvas element where the game is rendered can be dynamically created in the `Game` constructor. To get things started we need some parameters which can actually be given as constants, such as canvas dimensions, character sizes, parameters how to divide the screen into regions for the map, stats and log etc.

Because the display is split to so many different canvases, it's probably better to have a separate renderer object. Inside `game.render()` we check each component whether they have changed and call the renderer.

## 2021-08-15

Next: Really start re-writing the game. Create a constant game state and render it.

Rename old source files with `_old` suffix, start from scratch.

Keep the `index.html` file minimal and create the canvas elements and charset image elements dynamically.

```xml
<html>
  <head>
    <meta charset="utf8" />
    <link rel="stylesheet" href="layout.css" />
    <link rel="shortcut icon" href="favicon.png" type="image/png" />
  </head>
  <body>
    <script src="index.js"></script>
  </body>
</html>
```

Put the CSS in a separate stylesheet file. Use a class selector instead of a ton of IDs to set the canvas styles.

Create the canvas elements and set their attributes. The CSS transform has to be set dynamically (as we don't want to fix the dimensions outside the game itself).

Browsers complain not being able to find favicon. Let's create one. From MDN,

> Usually, a favicon is 16 x 16 pixels in size and stored in the GIF, PNG, or ICO file format.

Let's use the `@` symbol. Open the Codepage 850 charsheet in Gimp, copy the `@` and paste as new image. Choose _Image >> Canvas size_, resize to 16 by 16, under _Resize layers_ select _All layers_ and _Fill with foreground color_ (assuming it's black). Export as `favicon.png` or something, and add `<link>` tag to HTML header.

Introduce the concept of a _renderer_, which means a HTML canvas 2D drawing context, with a given rectangle (topleft corner, width and height) to draw in.

For the character sheets, it would be cleaner to give the image source file to the img elements instead of the Base64 string. I suppose we need an `onload` hook then, and create the rest of the game elements there.

Can I use a single character sheet, the one with the alpha values? The opaque sheet is used only for drawing text, for the stats and log canvases. Those could also use some colors.

## 2021-08-16

Created a bunch of renderers. For reference, they are responsible for:

- Stats
- Log
- Level color
- Visibility mask (dim out a bit tiles not currently visible)
  - This is the reason why level color and level map need to be separated
- Level (tile map characters)
- Seen mask (fog of war)
  - The array which this renderer uses is a property of the (current) level object
- Objects
- Debug

I want to render levels, so create a constructor function for levels. In the constructor:

- Create the level blueprint using the level generator
  - For now, parameters only include whether or not there are staircases up and/or down
- Create an empty (filled with `#`) tile map
- Carve the rooms in the tile map using the blueprint.
- Create a blank _seen_ mask (a 2d array same size as tile map, full of false)
- Create an _is occupied_ map, initialize with wall tiles being occupied, floor tiles not

## 2021-08-17

The color map (color of tiles) is also level-specific, i.e. property of the level object.

Similarly the symbol (and its color) representing a player or a monster is a property of the object.

Monsters and the player have a lot of properties in common. Let's do JS prototype based inheritance!

```js
function Character() {
  this.x = 0
  this.y = 0
  // ...
}

function Monster() {
  Character.call(this)
  // ...
}
```

## 2021-08-18

I already feel I'll need another major rewrite soon. How to organize the code? Should the player have a reference to the current level? Which one is better: `level.placePlayer(player)` or `player.enterLevel(level)`?

There is a duplicate loop over the tile map: updating the level seen mask when player position is updated, and rendering the seen mask.

`Event.keyCode` is deprecated? Ok, there's `KeyboardEvent.key` which contains the actual pressed key (e.g. `a` instead of 63). Yay! Side note: when I add support for capitalized keys, the `keyup` event does not work, as
