const GRID_SIZE = 15;
const CELL_WALL = 1;
const CELL_PATH = 0;
const CELL_DATA = 2;
const CELL_POWERUP = 3;

let score = 0;
let lives = 3;
let dataLeft = 0;
let gameRunning = false;
let gameStarted = false;
let powerUpActive = false;
let powerUpTimer = null;
let enemyMoveInterval = null;
let powerUpRegenInterval = null;
let currentLevel = 1;

let player = { x: 1, y: 1 };

// Enemy spawn area is in the center (like Pac-Man's ghost house)
const SPAWN_CENTER = { x: 7, y: 7 };

// Level configurations
const LEVELS = [
    {
        grid: [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,2,2,2,1,2,2,2,1,2,2,2,2,1],
            [1,2,1,1,2,1,2,1,2,1,2,1,1,2,1],
            [1,2,2,2,2,2,2,1,2,2,2,2,2,2,1],
            [1,2,1,1,1,1,2,1,2,1,1,1,1,2,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,1,1,2,1,1,1,1,1,1,1,2,1,1,1],
            [1,2,2,2,2,2,2,3,2,2,2,2,2,2,1],
            [1,2,1,1,1,1,2,1,2,1,1,1,1,2,1],
            [1,2,2,2,2,2,2,1,2,2,2,2,2,2,1],
            [1,2,1,1,2,1,2,1,2,1,2,1,1,2,1],
            [1,2,2,2,2,1,2,2,2,1,2,2,2,2,1],
            [1,2,1,1,2,1,1,1,1,1,2,1,1,2,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ],
        enemies: [
            { x: 7, y: 7, dir: 'up', icon: '🦠' },
            { x: 6, y: 7, dir: 'left', icon: '💀' },
            { x: 8, y: 7, dir: 'right', icon: '⚠️' },
            { x: 7, y: 6, dir: 'up', icon: '👾' },
            { x: 6, y: 6, dir: 'left', icon: '🕷️' },
            { x: 8, y: 6, dir: 'right', icon: '🐛' }
        ]
    },
    {
        grid: [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,2,1,2,1,1,1,2,1,1,1,2,1,2,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,2,1,1,1,2,1,1,1,2,1,1,1,2,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,2,1,2,1,1,1,1,1,1,1,2,1,2,1],
            [1,2,2,2,2,2,2,3,2,2,2,2,2,2,1],
            [1,2,1,2,1,1,1,1,1,1,1,2,1,2,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,2,1,1,1,2,1,1,1,2,1,1,1,2,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,2,1,2,1,1,1,2,1,1,1,2,1,2,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ],
        enemies: [
            { x: 7, y: 7, dir: 'up', icon: '🦠' },
            { x: 6, y: 7, dir: 'left', icon: '💀' },
            { x: 8, y: 7, dir: 'right', icon: '⚠️' },
            { x: 7, y: 6, dir: 'up', icon: '👾' },
            { x: 6, y: 6, dir: 'left', icon: '🕷️' },
            { x: 8, y: 6, dir: 'right', icon: '🐛' },
            { x: 7, y: 8, dir: 'down', icon: '🧟' }  // Zombie malware
        ]
    },
    {
        grid: [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,2,2,1,2,2,2,2,2,1,2,2,2,1],
            [1,2,1,2,1,2,1,1,1,2,1,2,1,2,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,1,1,2,1,1,1,2,1,1,1,2,1,1,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,2,1,1,1,2,1,1,1,2,1,1,1,2,1],
            [1,2,2,2,2,2,2,3,2,2,2,2,2,2,1],
            [1,2,1,1,1,2,1,1,1,2,1,1,1,2,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,1,1,2,1,1,1,2,1,1,1,2,1,1,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,2,1,2,1,2,1,1,1,2,1,2,1,2,1],
            [1,2,2,2,1,2,2,2,2,2,1,2,2,2,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ],
        enemies: [
            { x: 7, y: 7, dir: 'up', icon: '🦠' },
            { x: 6, y: 7, dir: 'left', icon: '💀' },
            { x: 8, y: 7, dir: 'right', icon: '⚠️' },
            { x: 7, y: 6, dir: 'up', icon: '👾' },
            { x: 6, y: 6, dir: 'left', icon: '🕷️' },
            { x: 8, y: 6, dir: 'right', icon: '🐛' },
            { x: 7, y: 8, dir: 'down', icon: '🧟' },  // Zombie malware
            { x: 8, y: 8, dir: 'left', icon: '👹' }   // Demon ransomware
        ]
    }
];

let enemies = [];

// Create a maze-like grid
let grid = [];

function loadLevel(levelNum) {
    const level = LEVELS[levelNum - 1];
    grid = level.grid.map(row => [...row]); // Deep copy
    enemies = level.enemies.map(e => ({...e})); // Deep copy
    player = { x: 1, y: 1 };
}

function initGame() {
    loadLevel(currentLevel);
    
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.style.gridTemplateColumns = `repeat(${GRID_SIZE}, 30px)`;
    gameBoard.innerHTML = '';

    dataLeft = 0;

    for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.id = `cell-${x}-${y}`;
            
            if (grid[y][x] === CELL_WALL) {
                cell.classList.add('wall');
                cell.textContent = '▓';
            } else {
                cell.classList.add('path');
                if (grid[y][x] === CELL_DATA) {
                    cell.textContent = '●';
                    cell.style.fontSize = '12px';
                    cell.style.color = '#00ff00';
                    dataLeft++;
                } else if (grid[y][x] === CELL_POWERUP) {
                    cell.textContent = '🔑';
                }
            }
            
            gameBoard.appendChild(cell);
        }
    }

    updateDisplay();
    render();
}

function render() {
    // Clear all entities
    for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            const cell = document.getElementById(`cell-${x}-${y}`);
            if (!cell.classList.contains('wall')) {
                if (grid[y][x] === CELL_DATA) {
                    cell.textContent = '●';
                    cell.style.fontSize = '12px';
                    cell.style.color = '#00ff00';
                } else if (grid[y][x] === CELL_POWERUP) {
                    cell.textContent = '🔑';
                    cell.style.fontSize = '24px';
                    cell.style.color = '';
                } else {
                    cell.textContent = '';
                    cell.style.fontSize = '24px';
                    cell.style.color = '';
                }
            }
        }
    }

    // Render enemies
    enemies.forEach(enemy => {
        const cell = document.getElementById(`cell-${enemy.x}-${enemy.y}`);
        cell.style.fontSize = '24px';
        if (powerUpActive) {
            cell.textContent = '😱';
        } else {
            cell.textContent = enemy.icon;
        }
    });

    // Render player (always on top)
    const playerCell = document.getElementById(`cell-${player.x}-${player.y}`);
    playerCell.style.fontSize = '24px';
    playerCell.textContent = '😼';
}

function movePlayer(dx, dy) {
    if (!gameRunning) return;

    const newX = player.x + dx;
    const newY = player.y + dy;

    if (grid[newY][newX] === CELL_WALL) return;

    player.x = newX;
    player.y = newY;

    // Check for data collection
    if (grid[newY][newX] === CELL_DATA) {
        grid[newY][newX] = CELL_PATH;
        score += 10;
        dataLeft--;
        
        if (dataLeft === 0) {
            winGame();
        }
    }

    // Check for power-up
    if (grid[newY][newX] === CELL_POWERUP) {
        grid[newY][newX] = CELL_PATH;
        score += 50;
        activatePowerUp();
    }

    checkCollisions();
    updateDisplay();
    render();
}

function activatePowerUp() {
    powerUpActive = true;
    gameRunning = false; // Pause the game
    
    // Cool hacker cat messages
    const messages = [
        "😼 'ACCESS GRANTED!'",
        "😼 'ROOT PRIVILEGES ACTIVATED!'",
        "😼 'FIREWALL DISABLED!'",
        "😼 'SUDO MODE ENGAGED!'",
        "😼 'ADMIN RIGHTS UNLOCKED!'",
        "😼 'BACKDOOR ACTIVATED!'"
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    showPowerMessage(randomMessage);
    
    if (powerUpTimer) clearTimeout(powerUpTimer);
    
    // Resume game after 2.5 seconds (longer pause), power-up lasts 7.5 seconds total
    setTimeout(() => {
        gameRunning = true;
        removePowerMessage();
    }, 2500);
    
    powerUpTimer = setTimeout(() => {
        powerUpActive = false;
        render();
    }, 7500);
}

function showPowerMessage(message) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'power-message';
    msgDiv.id = 'powerMessage';
    msgDiv.textContent = message;
    document.body.appendChild(msgDiv);
}

function removePowerMessage() {
    const msgDiv = document.getElementById('powerMessage');
    if (msgDiv) {
        msgDiv.remove();
    }
}

function regeneratePowerUp() {
    // Only regenerate if there's no power-up currently on the board
    const powerUpLocation = { x: 7, y: 7 }; // Center of the board
    
    if (grid[powerUpLocation.y][powerUpLocation.x] === CELL_PATH) {
        grid[powerUpLocation.y][powerUpLocation.x] = CELL_POWERUP;
        render();
    }
}

function startGame() {
    gameStarted = true;
    gameRunning = true;
    
    // Hide start button, show restart button
    document.getElementById('startBtn').classList.add('hidden');
    document.getElementById('restartBtn').classList.remove('hidden');
    
    // Start enemy movement
    if (enemyMoveInterval) clearInterval(enemyMoveInterval);
    enemyMoveInterval = setInterval(moveEnemies, 400);
    
    // Start power-up regeneration (every 10 seconds)
    if (powerUpRegenInterval) clearInterval(powerUpRegenInterval);
    powerUpRegenInterval = setInterval(regeneratePowerUp, 10000);
    
    render();
}

function moveEnemies() {
    if (!gameRunning) return;

    enemies.forEach(enemy => {
        const directions = {
            'up': { dx: 0, dy: -1 },
            'down': { dx: 0, dy: 1 },
            'left': { dx: -1, dy: 0 },
            'right': { dx: 1, dy: 0 }
        };

        let moved = false;
        let attempts = 0;

        while (!moved && attempts < 4) {
            const { dx, dy } = directions[enemy.dir];
            const newX = enemy.x + dx;
            const newY = enemy.y + dy;

            if (grid[newY][newX] !== CELL_WALL) {
                enemy.x = newX;
                enemy.y = newY;
                moved = true;
            } else {
                // Change direction if hit a wall
                const dirs = ['up', 'down', 'left', 'right'];
                enemy.dir = dirs[Math.floor(Math.random() * dirs.length)];
            }
            attempts++;
        }
    });

    checkCollisions();
    render();
}

function checkCollisions() {
    enemies.forEach(enemy => {
        if (enemy.x === player.x && enemy.y === player.y) {
            if (powerUpActive) {
                // Send enemy back to start
                score += 100;
                resetEnemy(enemy);
            } else {
                loseLife();
            }
        }
    });
}

function resetEnemy(enemy) {
    // Send enemy back to the center spawn area (like Pac-Man's ghost house)
    const spawnPositions = [
        { x: 7, y: 7 },
        { x: 6, y: 7 },
        { x: 8, y: 7 },
        { x: 7, y: 6 },
        { x: 6, y: 6 },
        { x: 8, y: 6 }
    ];
    const pos = spawnPositions[Math.floor(Math.random() * spawnPositions.length)];
    enemy.x = pos.x;
    enemy.y = pos.y;
}

function loseLife() {
    lives--;
    updateDisplay();
    
    if (lives <= 0) {
        gameOver();
    } else {
        // Reset player position
        player.x = 1;
        player.y = 1;
        showMessage('💥 Hit by malware! Lives remaining: ' + lives, '#ff0000');
        setTimeout(() => {
            document.getElementById('message').textContent = '';
        }, 2000);
    }
}

function gameOver() {
    gameRunning = false;
    gameStarted = false;
    if (enemyMoveInterval) clearInterval(enemyMoveInterval);
    showMessage('🚨 SYSTEM COMPROMISED! 🚨', '#ff0000');
}

function winGame() {
    gameRunning = false;
    gameStarted = false;
    if (enemyMoveInterval) clearInterval(enemyMoveInterval);
    if (powerUpRegenInterval) clearInterval(powerUpRegenInterval);
    
    if (currentLevel < LEVELS.length) {
        // More levels to go
        showMessage(`🎉 LEVEL ${currentLevel} COMPLETE! 🎉`, '#00ff00');
        setTimeout(() => {
            currentLevel++;
            initGame();
            document.getElementById('message').textContent = '';
            // Auto-start next level
            startGame();
        }, 2500);
    } else {
        // Won the entire game!
        showMessage('🏆 ALL LEVELS COMPLETE! YOU WIN! �', '#00ff00');
    }
}

function showMessage(text, color) {
    const msg = document.getElementById('message');
    msg.textContent = text;
    msg.style.color = color;
}

function updateDisplay() {
    // Display score in binary (with decimal in parentheses for reference)
    const binaryScore = score.toString(2).padStart(8, '0');
    document.getElementById('score').textContent = `${binaryScore} (${score})`;
    document.getElementById('level').textContent = currentLevel;
    document.getElementById('dataLeft').textContent = dataLeft;
    document.getElementById('lives').textContent = lives;
}

function restartGame() {
    score = 0;
    lives = 3;
    currentLevel = 1;
    gameRunning = false;
    gameStarted = false;
    powerUpActive = false;
    if (powerUpTimer) clearTimeout(powerUpTimer);
    if (enemyMoveInterval) clearInterval(enemyMoveInterval);
    if (powerUpRegenInterval) clearInterval(powerUpRegenInterval);
    removePowerMessage();

    document.getElementById('message').textContent = '';
    
    // Show start button, hide restart button
    document.getElementById('startBtn').classList.remove('hidden');
    document.getElementById('restartBtn').classList.add('hidden');
    
    initGame();
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (!gameStarted) return; // Don't allow movement until game starts
    
    switch(e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            e.preventDefault();
            movePlayer(0, -1);
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            e.preventDefault();
            movePlayer(0, 1);
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            e.preventDefault();
            movePlayer(-1, 0);
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            e.preventDefault();
            movePlayer(1, 0);
            break;
    }
});

// Initialize game board on load (but don't start game)
window.addEventListener('DOMContentLoaded', initGame);