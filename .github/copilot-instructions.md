# Cyber Games - AI Coding Agent Instructions

## Project Overview
This is a collection of browser-based educational games focused on computer science and cybersecurity concepts. Games are implemented as standalone, self-contained HTML/CSS/JavaScript files with no build process or external dependencies.

## Architecture Pattern

### File Organization
Each game follows a **three-file pattern**:
- `{game-name}.html` - Structure and UI elements
- `{game-name}.css` - Styling with cyberpunk/hacker aesthetic
- `{game-name}.js` - Game logic and state management

**Example**: `cyber-pacman.html`, `cyber-pacman.css`, `cyber-pacman.js`

### Game State Management
Games use vanilla JavaScript with **global state variables** at the top of the JS file:
```javascript
let score = 0;
let lives = 3;
let gameRunning = true;
```

No state management libraries or frameworks are used. All state is mutable and directly modified.

## Design Conventions

### Visual Theme
All games use a **cyberpunk/hacker aesthetic**:
- **Colors**: Neon green (`#00ff00`) on dark backgrounds (`#0a0a0a`, `#1a1a2e`)
- **Typography**: Monospace fonts (Courier New)
- **Effects**: Glow effects via `text-shadow` and `box-shadow` with green rgba values
- **UI Elements**: Bordered containers with `rgba(0, 255, 0, 0.1)` backgrounds

### Grid-Based Games
Games like `cyber-pacman.js` use **2D array grids** for level layouts:
```javascript
const GRID_SIZE = 15;
let grid = [[1,1,1,...], [1,0,2,...], ...]; // 1=wall, 0=path, 2=collectible
```

**Rendering pattern**: 
1. Generate DOM cells with unique IDs: `cell-${x}-${y}`
2. Update cell content via `getElementById` and `textContent`
3. Use emoji characters for game entities (😼 for player, 🦠💀⚠️ for enemies)

### Game Loop Structure
```javascript
// Player input via event listeners
document.addEventListener('keydown', (e) => { /* handle WASD + arrows */ });

// Enemy movement via setInterval
setInterval(moveEnemies, 400);

// Initialize on page load
window.addEventListener('DOMContentLoaded', initGame);
```

## Development Workflow

### Running Games
Simply **open HTML files in a browser** - no build step, no dev server required. Games are fully client-side.

### Testing
Manual testing only. Use browser DevTools console to inspect game state variables.

### Debugging
All games log to console via standard `console.log()`. Check browser console for errors.

## Code Style

### Naming Conventions
- **Constants**: UPPER_SNAKE_CASE (`GRID_SIZE`, `CELL_WALL`)
- **Variables**: camelCase (`gameRunning`, `powerUpActive`)
- **Functions**: camelCase action verbs (`movePlayer`, `checkCollisions`, `restartGame`)

### Function Organization
Functions ordered by purpose:
1. Initialization (`initGame`, `restartGame`)
2. Rendering (`render`, `updateDisplay`)
3. Game logic (`movePlayer`, `moveEnemies`, `checkCollisions`)
4. State changes (`loseLife`, `gameOver`, `winGame`)
5. Event handlers (at bottom of file)

### CSS Structure
1. Global resets (`* { margin: 0; }`)
2. Body/container styles
3. Game-specific components (`.cell`, `.stats`)
4. Interactive elements (`button:hover`)

## Adding New Games

When creating a new game:
1. Create three files: `{game-name}.html`, `{game-name}.css`, `{game-name}.js`
2. Link CSS and JS in HTML head/body
3. Apply cyberpunk color scheme with neon green accents
4. Use emoji for game characters when appropriate
5. Include restart button with `onclick="restartGame()"`
6. Add controls/legend sections for player guidance
7. No external dependencies - keep everything self-contained
