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

`Event.keyCode` is deprecated? Ok, there's `KeyboardEvent.key` which contains the actual pressed key (e.g. `a` instead of 63). Yay! Side note: when I add support for capitalized keys, the `keyup` event does not work, as, when pressing e.g. _Shift+M_, the _shift_ key is often released before the _m_ key and there is never a `keyup` event for capital _M_.

Logging. I want it clean and flexible. Could the logger be a singleton object, and all objects would get a reference to it? For example, player attacks a monster, there might be blocking or dodging which should be logged. For the moment it can be just a global object, but I'll probably do something like

```js
function Logger() {
  if (Logger.instance) {
    throw new Error('')
  }
  Logger.instance = this
  // ...
}

// Is this a static method?
Logger.getInstance = function() {
  return Logger.instance || new Logger()
}
```

Anyway, everything related to handling the log buffer can conveniently be encapsulated to the `Logger` class (or (constructor) function or whatever it is you call them).

I'm seeing some patterns and "stuff-going-to-its-right-place" now. For example, procedures which require only the coordinates of one or two entities fall naturally to the `LivingEntity` class.

## 2021-08-19

Some of the game logic gets easily mixed in with the rendering code. For example, monsters became "seen" in the `renderObjects` method. Move that to the `updateState` method: After player has finished their turn, loop over monsters and check if they are seen.

I should create a visibility mask (a simple 2D array) which is updated whenever the player moves, so the `isVisible` function need not be called more than once for every tile within the player visibility radius. Have to combine it with updating the seen mask of the level. It could actually be a property of the level, together with the seen mask. Update them together in the `Level.placePlayer` method.

Ok, I need one turns worth of visibility history. Let's just have another `isVisible` array in the level object.

Should probably combine some of the rendering loops, at least _seen_ and _visible_. On the other hand, is it faster to render all the stuff on one canvas first, instead of going back and forth between them?

Getting the lines of log to be printed could be done as a generator.

```js
function Logger() {
  this.logBuffer = [] // (long) lines of log, newest at index 0
  // ...
  this.getLog = function*() {
    while (linesLogged < this.numLines) {
      // compute next line from logBuffer
      yield line
      // ...
    }
  }
}
```

## 2021-08-20

Rendering the log with the transparent letters, I can't fill the log area with black before. Let's add color to the logger and text rendering. Also I have to pad the log lines to 80 characters wide. And also the logger has to return empty lines (filled with space bar) if log lines run out.

There should be a default text color, let's use the color on the character sheet, `#aaaaaa`.

Logging rewrite done, only the stats panel left. Now that we have multiple floors to our dungeon, let's show the current level in the panel.

Tiny bug: If there are multiple monster attacking the player, handling the attacks should stop when the player dies (the remaining monster skip their turn).

Formatting the log lines or stats lines should be done in the renderer, not the logger or game object.

I'd like to start using a module bundler (probably Webpack) to modularize the code. But let's do procedurally generated monsters first, as that's one of the current goal posts. So, how do I do that?

- Ignoring new monster spawning for the moment, each dungeon level has a "monster profile", meaning:
  - How many and what type of monsters to spawn
  - The average (or minimum and maximum) hit points and damage of each monster

That might be enough for "procedurally generated monster" for now. So, add the dungeon level as a parameter to the level constructor.

Monster property parameters depend on the dungeon level, so we need a `Monster.fromParameters(params)` factory function. Also the monster type (in effect, used character and color (also name)) will be set through the parameters, something like

```js
Monster.setType(type) {
  this.name = type.name
  this.char = type.char
  this.color = type.color
}
```

Do I have to start writing some sort of monster compedium right away?

The monster compendium/dictionary should work like this: For a given dungeon level (integer), get a list of possible monster types together with their spawn probabilities on that level. Then we roll for the monster type, and should get the spawner for that monster type, on that dungeon level. So the "spawner" is created from the monster dictionary and the level number, and it's just an object with methods to roll the monster stats.

Side note on the probabilities: I'd rather use easier-to-read weights which can then be normalized to probabilities at some point before rolling the monster type. For example, I could keep the weight of the normal monster a constant, and decrease the weight of the small monsters relative to that as dungeon level increases, and similarly increase the weight of the large and huge monsters.

## 2021-08-21

Planning next goal. I want to try out different map generation algorithms. And I want to write a better AI for the monsters, wayfinding in particular, so they don't lose the player around a simple corner. Wayfinding is also useful for player movement, I want to mimic ADOM's "walk" mode, perhaps also add _go to staircase_ commands. The wayfinding graph (or something equivalent) has to be added to the map generation.

Monster wayfinding could also be used to make "idle animations" of monsters, they could patrol around some area or move back and forth between some locations. There could even be some faciliites in the dungeon where the monsters work! That would fit well with the resource management theme I've been throwing around. Resource management could be the _unique twist_ this game would have.

## 2021-08-24

First, let's modularize the thing using Webpack. Put the built bundle to `docs/`, as Github pages can be built from that subdirectory.

## 2021-08-25/26/27

Writing the game code into a more modular form requires me to look at the relationships between the different entities. For example, starting the main game loop requires all assets to be loaded (in this case, only the character sheet).

- [x] Wire up Webpack dev server
  - NPM-install `webpack-dev-server`, add `mode: 'development'`, `devtool: 'source-map'` and `devServer: { static: './dist' }` to `webpack.config.js`.
- [x] Figure out how to debug a Webpack build with VSCode.
  - Following [this advice](https://stackoverflow.com/questions/46438471/how-to-use-vs-code-debugger-with-webpack-dev-server-breakpoints-ignored), add `context: path.resolve(__dirname, 'src')` to Webpack config, change entrypoint to `./index.js`, and in VSCode `launch.json`, change the port on the URL to match the dev server port, and add `/src` suffix to `webRoot`.
  - Seems to work.
- [x] Give names to functions (e.g. `this.setChar = function setChar(char) { /* ... */ }` in a constructor) for better stack traces to ease debugging

Now then, map generation.

- The result of map generation is the tile map.
- Not all map generation algorithms generate actual "rooms" so they can't (always) be the result.
- On the other hand, a room is a good unit to hold some special dungeon features. And a list of features is anyway useful for a lot of things, such as wayfinding.

Browsed through some dungeon generation resources, perhaps it's most interesting to try building my own algorithms.

Build a testing pipeline for generated maps. Note that it's not convenient to test in the Node REPL, because changes in the source code take effect only when restarting the REPL. Does it make sense to create a `test` folder alongside `src` for the tests? Nah.

Refactor the map generation code so that I can generate maps from the command line, view their tile maps and push them as playable levels in the game. The idea to use multiple mapgen algorithms directly implies the need for an abstract map generator "class" (what do I call them in JS? "object type"?).

Staircases should be placed outside the dungeon generation, in the `Level` constructor, as dungeon features. In room based maps, the staircases are placed in rooms. In non-room based, just use any unoccupied tile.

How to sample an unoccupied tile from the `isOccupied` mask? I don't want to resort to repeatedly (blindly) picking positions. Well, I guess it'll do for now, it's used only in sampling the monster positions.

Add a debug mode to the game: Instead of generating a random dungeon level, load the level from a given file. Show the whole level, including all monsters (possibly also their hit points and other stats).

_Side note_: _Ctrl-B_ to hide side bar in VSCode. How to go to next syntax error? _F8_.

## 2021-08-28

How could the map generation be parametrized? In terms of the dungeon level, for example. The level layout itself perhaps need not really change in deeper levels. The available feature sets could very well depend on the level though. Change the goal posts for this goal a little: Remove parametrized map generation and add map features.

Some interesting map features:

- Underground rivers
- _Prefabs_, i.e. small hand-made dungeon elements such as temples, vaults, mazes
- Crumbled sections of a level (irregular non-room based layout in a part of the level)
  - This could be done mixing two different map generation algorithms on one level
- Friendly NPCs (shopkeepers, healers, ...)
  - Healers could be used as a means to refill HP before an item system is made

## 2021-09-04

The _Binary Space Partition_ map generation algorithm is quite interesting. The partitions form a binary tree in a natural way, and I guess the idea is to connect "leaf rooms" (rooms created in leaf partitions) which have the same parent partition, and then connect one of the leaf rooms to one of their "cousins" etc. So let's make a proper data structure to handle this. Do I need an object type for the data structure itself, or is it enough to have the nodes of the structure? A node would have pointers to its parent and children.

And for there to be some benefit in using this data structure, the algorithm for generating the partitions has to be recursive. That is, the _split_ function has to be a method of the node class (or just a function which takes as argument a node).

But if I don't have a "container" for the nodes, where do they "live"? In some scope, not garbage collected, I guess, but that's not very clean... Could be pushed to a global array?

## 2021-09-05

Some partitions in the BSP algorithm could be left without a room (some may be too small), or they could be left unsplit. Partitions without a room could be used to house dungeon features, prefabs etc.

Did a first version of BSP. The generated levels look very boring, the rooms are often in rows. Let's try to prefer doing horizontal splits in "horizontal" (i.e. width > height) partitions, and vice versa. For example, split vertically if `Math.random() < height / (width + height)`.

A lot nicer level layouts. Perhaps I should also stop splitting a bit earlier, there are too many rooms, and the partition dimensions are too often close to the minimun room dimensions. I can tune the parameters later, now let's carve the connecting corridors. What's the logic there?

- Loop over leaf nodes, connect each one with its sibling
  - During this loop, mark each connected node so they don't get connected twice.
  - If a leaf node does not have siblings with rooms, consider it connected (it will be connected to its cousins in the next step)
- Loop over parents of leaf nodes, connect each one with its sibling
  - Non-leaf nodes don't have rooms, so what does this mean?
  - For each such pair of a parent node and its sibling, find two random (leaf) children of both and connect them.
  - But if I choose the descendants at random, there is bound to be a lot of overlapping corridors in the level...

## 2022-04-16

Now where was I? Trying to get the BSP algorithm to work. It should be debuggable in VSCode (oh btw, switched from OSS Code to VSCode -- remove all ST3 stuff like `*.sublime-*`).

The algorithm seems to place rooms just fine, just the corridors are missing. Hmm, not a trivial matter... Might need to re-implement the space partition (?).

Each node has either two or zero children. The _first child_ of a node (if there are any) is either the "left child" or the "upper child", depending on whether the node was split horizontally or vertically.

Should probably store a flag indicating the splitting direction. Whenever we split a node, it creates a pending task to the phase of creating connecting corridors: At least one corridor has to connect two rooms on opposite sides of the splitting line...

Am I making this more difficult than it should be? Just store the rooms in the space partition phase and connect the rooms using a similar algorithm as with the _random rooms_ generator? I want BSP style dungeons to be "cleaner" in the sense that there are not that many corridors crossing each other and running parallel. (On the other hand, the RR (Random Rooms) algorithm could also connect closest rooms)

A simple way to keep track of the geometry is to store the location on screen of each node (top, left, widht, height).

Enumerate all possible cases: connecting siblings which both are leaf nodes is easy, just pick a random point inside each room and connect them with a (three-segment?) corridor.

```
  o
 / \
o   o
```

Connecting siblings `n1` and `n2`, one of which, say `n1` (the _first child_), is a leaf node and the children of the other are also leaf nodes:

- If the splitting direction of `n1` from `n2` is _different_ from the splitting direction of the children of `n2` from each other, then both children of `n2` are adjacent to `n1`. In this case, pick a point at random from the room inside `n1`, find the child of `n2` which is closest to this point, and connect `n1` to this child.
- If the splitting directions are the same, then one and only one of the children of `n2` is adjacent to `n1`. Find the adjacent child and connect `n1` to this.

Side note: Computing (Manhattan) distances of (non-overlapping) axis-aligned rectangles with top-left coordinates `(x1,y1)` and `(x2,y2)`, and widths and heights `w1`, `h1`, `w2`, `h2`: We say that the rectangles _x-overlap_ if `x1 < x2 + w2` and `x2 < x1 + w1`. If the rectangles do _not_ x-overlap, their _x-distance_ is `min(abs(x1 + w1 - x2), abs(x2 + w2 - x1))`. If they _do_ x-overlap, their x-distance is zero. Define _y-overlap_ and _y-distance_ similarly. Finally, the _distance_ between the rectangles is the sum of their x- and y-distances.

```
  o
 / \
o   o
   / \
  o   o
```

Connecting siblings `n1` and `n2`, neither of which is a leaf node, but the children of both (call them `n11`, `n12`, `n21` and `n22`) are leaf nodes:

- If the splitting direction of `n1` from `n2` is different than _both_ splitting directions among their children, then both of `n11` and `n12` are adjacent to at least one of `n21` and `n22` and vice versa. Pick at random and connect.
- If all splitting directions are the same, connect the last child of `n1` to the first child of `n2`.
- If exactly one of the splitting directions of the children is the same as that of the parent, then this reduces to the previous case.

```
     o
   ./ \.
  o     o
 / \   / \
o   o o   o
```

Comparing the splitting direction of the parents and children is the key to the recursion logic.

Hmm, not all nodes have rooms...

## 2022-04-17

First implement connecting leaf node siblings. Take advantage of the splitting direction. Hmm, "splitting vertically" means splitting along a _horizontal_ axis... Let's just rename the methods: we split _along the horizontal_ if we divide the node into an upper and a lower part, and analogously splitting _along the vertical_.

The _Room_ class quite naturally houses everything one might want to do with axis-aligned rectangles.

How to avoid `var self = this`?

Not having a room in all nodes kinda makes things complicated...

I guess the general rule is this: To connect a node `n1` to its sibling `n2`, find the pair of rooms `(r1, r2)` such that `r1` is among the descendants of `n1` and `r2` among the descendants of `n2`, and the pair minimizes the distance between rooms in the branches rooted at `n1` and `n2`. This approach doesn't take any advantage of knowing the split axes though, but let's just implement it to get the BSP to a working state.

Works. Yay. :+1: :smiling_face: And indeed, BSP gives a lot more "sprawling" dungeons, especially if the first split happens along the horizontal.

I could change the RR map generator to connect rooms to their closest neighbors, so the dungeon feel would not be so different from BSP. The _corridor generation_ algorithm could in general be used to alter the feel.

Another possible algorithm for generating this type of dungeons: Start by placing a room at random, pick a random point from the room and start a (non-overlapping) random walk: Pick a (cardinal) direction and number of squares to advance (from a given distribution), carve a corridor, then pick a new direction or place a room (probability of placing a room increases as the walk progresses). Try each room or corridor placement a parametrizable number of times, and if it fails, choose a new starting point for a new random walk (this could lead to dead-end corridors!). Starting points could include the existing corridors, to get branching corridors.

**But**, before adding more map generation algorithms, let's do hall of fame! For this, keep track of player "score". Simplest thing that comes to mind: each kill is worth a number of points depending on the type of monster and the current dungeon level.

For now use the dollar sign for player score. How to use some of the more exotic Codepage characters? I suppose I should be able to "type" those characters in VSCode...

Having a (first local) HOF requires introducing game states, similarly as in my platformer project: All code written so far (all event handlers and canvas rendering logic) pertain to the main game state. In addition, we'll have (at least) a splash screen and a "You are dead" screen.

Not sure if `GameState` has enough substance to be a whole class. Almost everything is in the main game loop,

## 2022-04-18

Write a "fake" local HOF first, to see what kind of game state logic and possible refactoring is needed. At least I need to implement a _clear_ method on all game states, a method which fills all canvases with transparent.

A real local HOF could also be nice, store it in browser local storage.

The splash screen and the hall of fame are not animated screens, but I'll probably want to add some animations later on, so let's keep the `requestAnimationFrame` stuff there.

Hmm, the BSP dungeons might be a bit too winding. If the first split is made along the horizontal, then the level consists of two rows of rooms, connected by a single corridor (and hardly ever any loops?)

When I get to implementing wayfinding, I'll probably generate a Dijkstra map of the level, which tells me the distances between walkable points. That should enable some level diagnostics.

Hmm, I've been using `cancelAnimationFrame` wrong, I've given it as argument the function which I've passed to `requestAnimationFrame` earlier. One is supposed to pass it the _handle_ (a number) returned by the request function.

## 2022-04-19

The online hall of fame should accept POST requests with new entry as payload and return the top 8 (what currently fits one screen).

I'll implement it using ExpressJS and SQLite, through the NodeJS `sqlite3` library.

## 2022-04-21

Deployed the online HOF on a server, now to wire the "frontend" :)

The server should respond with the ranking. Later I'll make the high score list "paged", but for now it shows only the top eight or something. The ranking will be implemented by ordering the table first by score, second by `ROWID`. Hmm, this might not always be correct: If rows from the table are deleted, it frees the row IDs, so sometimes later entries with the same score are ranked higher.

## 2022-04-22

How to dump SQLite database into a SQL file? In `sqlite3`, run `.output hof.sql` and `.dump`.

A little annoying bug: monsters can spawn on the staircase. For that purpose we should consider stairs to be _occupied_, but player should still be able to walk to them. Let's introduce a _spawnable area_ mask. This could be used later to spawn new enemies in a level, one requirement would be distance from the player.

I should set scope for the goal post "Different map generation algorithms". I have two now, that's not enough. There are two main types of dungeons: The classic room-based, and more "realistically" cavernous. Using the former, a lot of variety could be achieved with different corridor generation algorithms. In particular, the corridors should be _deliberate_, no random intersections or parallel corridors running on adjacent tile rows/columns resulting in double/triple wide hallways.

Another way to introduce variety to room-based dungeons is by _corrosion_. Check out Herbert Wolverson's [video](https://www.youtube.com/watch?v=TlLIOgWYVpI) on procedural map generation techniques for examples.

So a breakdown of what's remaining for the _mapgen_ goal post:

- [x] A corridor placement algorithm
- [x] Erosion in room-based dungeons
- [x] Cavernous dungeon level generation

## 2022-09-03

Not sure if this was already the case before, but debugging the game works now, as follows:

- Run `webpack-dev-server` from the command line.
- Run the _Launch Chrome against localhost_ debug configuration from VSCode.
- Breakpoints in the `/src` folder are in effect. :+1:

I'd like to refactor the game code (once again). This time, start using the `class` keyword of JavaScript for cleaner code. But content is more important, so focus on the map generation algorithms, as planned.

Side note: To hide debug console, press _Ctrl + Shift + Y_ twice: first to focus on the console, second time to hide it.

### Corridor generation

Starting point: rectangular rooms have been placed in the level.

General notes:

- Rooms and corridors should not "brush" against each other, e.g. two corridors should not go parallel to each other in adjacent rows or columns.
  - Avoiding brushing enables placing doors!
- Could we actually first make a skeleton of the corridor system in the dungeon level -- effectively a sort of graph -- and then carve out rooms in some nodes of the graph?
  - Is it simpler to connect a set of points with corridors than a set of rooms?
- How about, after placing the rooms, mark each tile on the level map with a number telling the distance to the nearest room
  - Label all tiles within rooms `0`
  - For all tiles adjacent to a tile labelled `k` which don't yet have a label, label them `k+1`
  - This, in effect, would generate a Dijkstra style map (maybe not really Dijkstra...), which bears some very critical information about where on the level map the corridors can go without brushing against rooms.

Possible approaches:

- Favor shortest connections:
  - Compute the "distance matrix" of the rooms, i.e. all distances between pairs of rooms
  - Intepret the distances as being between _sets_ of rooms, only at this point each set consists of only one room.
  - Start by connecting the two rooms which are closest to each other, i.e. find the minimum entry in the distance matrix.
    - A single connecting corridor can be a straight line or L-shaped.
    - It can be placed by picking a random point in each room, i.e. in the "usual" way.
  - Refresh the distance matrix:
    - Combine the two connected rooms into a single set, and add the corridors to the set too.
    - Distance between two sets of rooms is the minimum of the pairwise distances.
- Random walk!
  - This method requires the "Dijkstra" map described above.
  - In addition to that map, tiles in the corners of rooms are marked impassable
  - Pick a random room and a random tile within that room.
  - Pick a direction at random (among the four cardinal directions) and advance to that direction.
  - If the walk enters a `1` tile, mark all adjacent `1` tiles impassable (to prevent brushing).
  - On the next step, pick a random direction from the three "new" directions (i.e. don't backtrack).
  - If tiles in all three new direction are impassable, then backtrack to previous tile (that is, choose as direction)
  - When making a turn, mark the tile on the "inside" of the turn as impassable (to prevent "2D" areas in corridors).

The random walk algorithm sounds tempting. Let's implement that, and also create a mechanism for the random corridor placement algorithm to avoid brushing. This is probably achieved by simply testing for brushing when placing a corridor, and if it does brush, re-run the algorithm.

## 2022-09-04

First tests with the random walk algo: Most of the time it fails to connect even half of the rooms. Hmm, there are some bugs, it seems tiles are not accurately marked as impassable.

Also, I don't want the random walk to wander around the rooms, I want it to dig in the walls! To make this happen, whenever the walk enters (or stays in) a room, pick a random position from the edge tiles of the room (pick an edge at random, 1 through 4, and a random position depending on the edge).

For this we also need to find the room index corresponding to a given point on the map. These could be marked down when placing the rooms.

The starting point (and the reset point when entering a new room) needs to satisfy the condition that the random walk can enter two tiles into the wall into the given direction.

Hmm, perhaps it can't be just _one_ random walk, there needs to be a mechanism to restart the walk from another room.

While writing the random walk algorithm I have recognized the importance of (and also actually implemented) many utility function related to the tile map and the room layout, such as `canDigTo` and `canAdvanceTo`. These could be used as is in the random corridor placement method: just verify before placing a corridor that the course is clear.

The random walk algorithm is (in its current form) quite unsatisfactory. The rooms thenselves are nice and tidy rectangles, and the more organic feel of the random walk path doesn't really fit in with that. I want to have a complex arrangement of mostly straight corridors, with intersections and stuff like that.

I feel like we're about to introduce some definitions!

### Corridor placement definitions

A _room_ (basically a rectangle) is defined (probably somewhere above) as the quadruplet `(x, y, w, h)` where `(x, y)` are the coordinates of the top-left corner of the room (index of the top-left tile which is a part of the room), `w` is the width and `h` the height of the room. Note that the tile at `(x + w, y + h)` is not part of the room.

A _corridor segment_ is a special case of room, with either width or height equal to one. A corridor segment is _vertical_ if `h > 1` and _horizontal_ if `w > 1`. The _end points_ of a corridor segment are `((x, y), (x + w, y))` for horizontal segments and `((x, y), (x, y + h))` for vertical segments.

A _corridor_ is a list of corridor segments `(c_i)` with alternating horizontal and vertical segments, such that `c_i` and `c_{i+1}` intersect at their end points.

Given a room layout of the dungeon level, that is, an n-tuple `(r_i)` of rooms, `r_i = (x_i, y_i, w_i, h_i)`, we first of all assume that the rooms are _disjoint_, with a spacing of at least one. That is, no two rooms overlap each other (see definitions above), and any tile which is _adjacent_ to a room `r_i` (tile `(x, y)` with either `x_i <= x < x_i + w_i` and (`y == y_i - 1` or `y == y_i + h_i`), or `y_i <= y < y_i + h_i` and (`x == x_i - 1` or `x == x_i + w_i`)), is not part of any room.

To determine allowable corridor layouts, given a room layout as above, we must exclude some points, such as points adjacent to room corners, `(x_i - 1, y_i - 1)`, `(x_i + w_i, y_i - 1)`, `(x_i + w_i, y_i + h_i)` and `(x_i - 1, y_i + h_i)`.

Let `A(x, y)` be shorthand for "the tile at `(x, y)` allows a corridor through it". For example, `A(x, y)` is false for the corner points of the previous paragraph.

As we want to avoid "brushing" of corridors against each other and against rooms, the mapping `A` is affected by the placement of a corridor, even a single tile of it. So a tilemap _allowing a corridor (segment)_ `c` can not be defnied in terms of the tiles which are part of it allowing a corridor.

How to define _brushing_? Note that we want to allow the _intersection_ of two corridors, which in effect says that a horizontal and a vertical corridor segment cannot brush against each other. A room and a corridor segment (or two corridor segments -- note that two rooms cannot _a fortiori_ brush), denoted by `r_1` and `r_2`, _brush against each other_, or `r_1` _brushes_ `r_2`, or vice versa, if either

- `r_1` is a horizontal corridor segment and, either `y_1 == y_2 - 1` or `y_1 == y_2 + h_2`, and, `r_1` and `r_2` _x-overlap_ each other or `x_1 == x_2 + w_2` or `x_1 + w_1 == x_2`
  - The latter condition could be summarized as `r_1` and `r_2` _x-overlapping with padding 1_
- `r_2` is a vertical segment and, either `x_1 == x_2 - 1` or `x_1 == x_2 + w_2`, and `r_1` and `r_2` y-overlap with padding 1

Not allowed (x-overlap with padding 1):

```
###...#
###...#
...####
#######
```

The above condition can be used to verify that the tilemap allows a candidate corridor segment. But how do we decide where to choose the candidate segments? Also note that when placing a _corridor_, if it consists of more than two segments, we have to check for brushing among the segments.

In the current algorithm, we choose two rooms at random, pick representative points in both rooms at random, and connect these two points using an L-shaped corridor. We choose at random whether to do a horizontal or vertical segment first. This process yields a candidate corridor, which could be checked for brushing.

---

Apparently it's possible that for some pairs of rooms it is not possible to find a non-brushing corridor. That's fairly easily solved by giving up on a pair of rooms after a certain number of attempts.

It's still theoretically possible that some tilemaps don't allow for a non-brushing corridor layout, or (which is more likely) that laying out the corridors sequentially might lead to a situation where no more corridors are allowed. I ran the mapgen test quite many times but didn't observe such a case.

## 2022-09-06

Should I re-purpose the random walk algorithm for generating dungeons, instead of corridors? Different types of dungeon levels could alterate, for example have ten room-based dungeons, then a few random walk style caverns, then back to regular room-based, etc.

Yes, let's refactor (and simplify!) the random walk algorithm into a form more suitable for carving out dungeons.

I imagine the random walk dungeon is conceptually very different to the previous algorithms. First of all, it is _not_ room-based. Do some parts of the game code assume that dungeon levels contain well-defined rooms? Remains to be seen, for the moment I'll just run the mapgen test to see what the levels look like.

First implementation, just start at the center and do a uniform, unrestricted, unguided random walk until a given portion of the level is covered.

A simple note: As the map width and height are not equal, the random walk directions can not be equally probable. A utility function to sample from a list with given probabilities would be very useful for future developments. I could imagine a "guided" random walk algorithm, which is given a starting points plus a sequence of focus points. The walk keeps track of the distance to the next focus point, and slightly favors those directions. When it has reached the focus (or gotten close enough), change focus to the next point.

Pretty decent looking dungeons, unless the random walk ends up hugging the edges. Let's make it "bounce off" the edges by reversing its direction.

How to place stairs in a random-walk dungeon? Here I could implement a distance map and find two points which are sufficiently far from each other. But for the first implementation, let's just pick two points at random.

Delightfully, it seems that placing monsters and the player do not depend on the dungeon consisting of rooms, so the randomw walk mapgen might work already.

## 2022-09-08

Let's fine tune the random walk algo (add the focus points etc) later. One possibility to tweak it to get less edge hugging would be to reset the walk to the center, or to a random open tile whenever the walk reaches the edge. This method is also recommended in Herbert Wolverson's video. Re-watching that video, _Diffusion Limited Aggregation_ sounds interesting. [Here's](http://roguebasin.com/index.php/Diffusion-limited_aggregation) a RogueBasin article on that. Not sure I fully understand it, though. Should implement it...

Next map generation feature: erosion. The starting point would be e.g. the random rooms map. First implementation idea: Pick random floor tiles, then pick a direction at random, and walk to that direction until a wall tile is hit. When that happens, change the wall to a floor tile.

## 2022-09-09

Hmm, or maybe not. If I understood DLA correctly, you're supposed to fire "particles" (the term used by Wolverson) at the whole map at random, and when it hits a tile which is _adjacent_ to a floor tile, turn that tile into floor.

This would simulate the gathering together of randomly moving particles.

Slightly eroded dungeon levels look a bit dull, but strongly eroded dungeons are quite cool. You can still make out a hint of the room layout.

It would be a cool dungeon feature to have erosion in just a small part. This leads to discussion about map features in general.

What possible map features are there?

- eroded rooms
  - applicable only to room based dungeons
- erosion of the whole level
- chasms (the player could fall down)
- underground rivers
- pre-fabricated ("man-made") structures

Chasms and rivers require new tiles ("emptyness" and water).

Also, if I want to add resource management to the game, _ore veins_ could be a feature!

At first I listed having several (two) map generation algorithms used in one level. But that is conceptually different from the rest, let's scope that out. For this goal post, map features are considered only as stuff which can be overlaid on top of an already generated level.

How are map features implemented in the code organization sense? As first implementation, a dungeon level could have either zero or one features, with some parametrizable probability of adding a feature. If a feature is to be added, it is selected randomly from all available features. _A priori_ not all features are applicable to all dungeon levels, so adding a feature should be allowed to (silently) fail.

Features could be sub-classed from an "abstract feature" which would define the _Feature API_ (basically just `addToLevel`...)

Let's try converting the level erosion into a feature.

## 2022-09-10

Note: dungeon features must be added (and other stuff done which alter the tile map) before computing the "derivative" masks (depending on the tile map).

It makes sense to add the feature to the _generator_, not the `Level` instance which also contains the monsters, player placement etc.
