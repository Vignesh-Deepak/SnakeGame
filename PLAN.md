# Snake Game: Implementation Plan (for Cursor)

## 0. Instructions to Cursor
- Follow the milestones in order. Finish and verify one before starting the next.
- Do not add features, libraries, or files that are not in this plan. If something seems needed, stop and ask first.
- Keep the code simple and commented. This is a beginner-friendly project.
- The game must run by double-clicking `index.html`. No server, no build step, no npm.

## 1. Goal
A classic Snake game that runs locally in the browser. The snake moves on a grid, eats food (the "ball"), grows by one segment each time, and the game ends if it hits a wall or itself.

## 2. Tech Stack (decided)
- Plain HTML + CSS + JavaScript
- Rendering: HTML `<canvas>` (2D context)
- No frameworks, no dependencies
- Use a normal `<script src="game.js"></script>` tag. Do NOT use ES modules (`type="module"`), because browsers block them when a page is opened from `file://`.

## 3. Project Structure
```
snake-game/
├── index.html    # page shell: canvas, score display, overlay messages
├── style.css     # layout and theme
├── game.js       # all game logic
└── PLAN.md       # this file
```

## 4. Game Rules
| Rule | Value |
|---|---|
| Grid | 20 x 20 cells |
| Cell size | 24 px (canvas 480 x 480) |
| Start | Snake length 3, centered, moving right |
| Tick speed | 120 ms per move (fixed) |
| Food | 1 ball at a time, spawns on a random empty cell |
| Eating | Snake grows by 1, score +1, new food spawns |
| Death | Hits a wall or its own body |
| Reverse | Snake cannot instantly reverse into itself (e.g. right to left) |

## 5. Controls
- Arrow keys or WASD to steer
- Space to pause/resume
- Enter (or Space) to start and restart after game over

## 6. Visual Design (default, easy to change)
- Dark background, gold accents
- Snake: gold body with a slightly brighter head
- Food: a round ball (filled circle) in a contrasting color
- Score text in a serif font (Georgia or similar)
- Centered canvas with a thin gold border
- Define colors as CSS variables / JS constants at the top of the files so the theme is easy to edit

## 7. Core Data Model (game.js)
```js
const GRID = 20;
const CELL = 24;
const TICK_MS = 120;

let snake;      // array of {x, y}, index 0 is the head
let direction;  // {x, y}, current movement
let nextDir;    // {x, y}, buffered input applied on next tick
let food;       // {x, y}
let score;
let state;      // "ready" | "running" | "paused" | "gameover"
let timerId;
```

## 8. Milestones

### M1: Page shell
- Create `index.html`, `style.css`, `game.js`.
- Canvas 480x480 centered on a dark page, with a score label above it.
- **Done when:** opening `index.html` shows an empty bordered canvas and "Score: 0".

### M2: Draw the grid objects
- Write `draw()` to render the snake and food on the canvas.
- Hardcode a snake of length 3 and one food cell for now.
- **Done when:** a gold snake and a ball are visible at the right grid positions.

### M3: Movement loop
- Add `setInterval` game loop using `TICK_MS`.
- Each tick: compute new head, add it to the front, remove the tail.
- **Done when:** the snake moves right continuously.

### M4: Keyboard input
- Handle arrow keys and WASD with `keydown`.
- Store the input in `nextDir`, apply it at the start of the next tick.
- Block 180-degree reversals.
- **Done when:** the snake can be steered in all four directions and cannot flip back onto itself.

### M5: Food and growth
- Spawn food on a random cell not occupied by the snake.
- On eating: do not remove the tail that tick (this grows the snake), increase the score, spawn new food.
- **Done when:** eating the ball makes the snake one segment longer and the score goes up by 1.

### M6: Collision and game over
- Detect wall collision and self collision.
- On death: stop the loop, set state to `gameover`, show a "Game Over / Press Enter to restart" overlay with the final score.
- **Done when:** hitting a wall or its own body ends the game, and Enter starts a fresh game with the score reset.

### M7: Start and pause
- Start in the `ready` state with a "Press Enter to start" overlay.
- Space toggles pause/resume while running.
- **Done when:** the game does not move until started, and pausing freezes it fully.

### M8: Polish pass
- Apply the visual design from section 6.
- Clean up code, group constants at the top, add short comments.
- **Done when:** the game looks consistent and the code is readable top to bottom.

## 9. Acceptance Checklist (final)
- [ ] Opens by double-clicking `index.html`, with no console errors
- [ ] Snake moves, turns, and cannot reverse into itself
- [ ] Food never spawns on the snake
- [ ] Eating grows the snake by exactly 1 and adds exactly 1 point
- [ ] Wall hit and self hit both end the game
- [ ] Restart fully resets snake, direction, food, and score
- [ ] Pause and resume work

## 10. Out of Scope (do NOT build unless asked)
High score saving, speed increase, sound, mobile/touch controls, difficulty levels, multiple food types, obstacles.

## 11. How to Run
Double-click `index.html`, or drag it into a browser window. Refresh the page after editing code.
