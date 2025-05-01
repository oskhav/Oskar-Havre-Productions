// Henter canvas-elementet fra HTML og setter opp 2D-konteksten for tegning
const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

// Skalerer tegningen for at hvert blokk skal være enklere å jobbe med
context.scale(20, 20);  

// Fargevalg for Tetris-brikkene
const colors = [
    null, '#f39c12', '#2ecc71', '#3498db', '#9b59b6', '#e74c3c', '#f1c40f', '#e67e22'
];

// Oppretter et spillbrett (arena) med dimensjonene 12x20
let arena = createMatrix(12, 20);

// Spillerens egenskaper: posisjon, brikke, poengsum, nivå og antall linjer
let player = {
    pos: { x: 0, y: 0 },
    matrix: null,
    score: 0,
    level: 1,
    lines: 0,
};

// Variabler for nedtelling (fallhastighet) og tid
let dropCounter = 0;
let dropInterval = 1000; // Start hastighet på 1000ms (1 sekund)
let lastTime = 0;

// Funksjon som lager en tom matrise (spillbrett)
function createMatrix(width, height) {
    const matrix = [];
    while (height--) matrix.push(new Array(width).fill(0));
    return matrix;
}

// Funksjon som lager en brikke basert på type
function createPiece(type) {
    if (type === 'T') return [[0, 1, 0], [1, 1, 1], [0, 0, 0]];  // T-form
    if (type === 'O') return [[2, 2], [2, 2]];  // O-form
    if (type === 'L') return [[0, 0, 3], [3, 3, 3], [0, 0, 0]];  // L-form
    if (type === 'J') return [[4, 0, 0], [4, 4, 4], [0, 0, 0]];  // J-form
    if (type === 'I') return [[0, 0, 0, 0], [5, 5, 5, 5], [0, 0, 0, 0]];  // I-form
    if (type === 'S') return [[0, 6, 6], [6, 6, 0], [0, 0, 0]];  // S-form
    if (type === 'Z') return [[7, 7, 0], [0, 7, 7], [0, 0, 0]];  // Z-form
}

// Funksjon som sjekker om spilleren kolliderer med arenaen
function collide(arena, player) {
    const [m, o] = [player.matrix, player.pos];
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            if (m[y][x] !== 0 &&
                (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

// Funksjon som slår sammen spillerens brikke med arenaen
function merge(arena, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                arena[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}

// Funksjon som tegner brikkene på skjermen
function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = colors[value];
                context.fillRect(x + offset.x, y + offset.y, 1, 1);
            }
        });
    });
}

// Funksjon som tegner et grid over spillområdet
function drawGrid() {
    context.strokeStyle = 'rgba(249, 242, 242, 0.1)'; // Lyse grid-linjer
    for (let x = 0; x < canvas.width / 20; x++) {
        for (let y = 0; y < canvas.height / 20; y++) {
            context.strokeRect(x, y, 1, 1); // Tegner små grid-ruter
        }
    }
}

// Funksjon som oppdaterer og tegner hele skjermen
function draw() {
    context.fillStyle = '#34495e';  // Bakgrunnsfarge for spillet
    context.fillRect(0, 0, canvas.width, canvas.height);

    drawGrid(); // Tegn grid først
    drawMatrix(arena, { x: 0, y: 0 });
    drawMatrix(player.matrix, player.pos);
}

// Funksjon som tilbakestiller spilleren og lager en ny brikke
function playerReset() {
    const pieces = 'ILJOTSZ';
    player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);  // Velg tilfeldig brikke
    player.pos.y = 0;
    player.pos.x = (arena[0].length / 2 | 0) - 
                   (player.matrix[0].length / 2 | 0);  // Plasser spilleren på toppen av arenaen

    // Sjekk om kollisjon skjer
    if (collide(arena, player)) {
        endGame();  // Hvis kollisjon, avslutt spillet
    }
}

// Funksjon som roterer brikken
function rotate(matrix, dir) {
    const pos = player.pos.x;
    let offset = 1;

    // Roterer matrisen
    const rotated = matrix.map((_, i) => matrix.map(row => row[i]));
    if (dir > 0) rotated.forEach(row => row.reverse());  // Roter med klokken
    else rotated.reverse();  // Roter mot klokken

    // Sjekk om den roterte brikken passer
    player.matrix = rotated;
    while (collide(arena, player)) {
        player.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > player.matrix[0].length) {
            player.pos.x = pos;
            return;
        }
    }
}

// Funksjon som kaller på rotasjon
function playerRotate(dir) {
    rotate(player.matrix, dir);
}

// Funksjon som fjerner linjer som er fullstendige
function clearLines() {
    let rowCount = 1;
    outer: for (let y = arena.length - 1; y >= 0; --y) {
        for (let x = 0; x < arena[y].length; ++x) {
            if (arena[y][x] === 0) continue outer;
        }
        const row = arena.splice(y, 1)[0].fill(0);
        arena.unshift(row);
        ++y;

        player.score += rowCount * 10;  // Øk poengsummen
        player.lines++;
        rowCount *= 2;  // Øk multiplikatoren

        // Øk nivået etter hver 10. linje
        if (player.lines % 10 === 0) {
            player.level++;
            dropInterval = Math.max(100, 1000 - (player.level * 100));  // Øk hastigheten etter hvert nivå
        }
    }

    // Oppdater skjermen med ny poengsum, nivå og linjer
    document.getElementById('score').textContent = player.score;
    document.getElementById('level').textContent = player.level;
    document.getElementById('lines').textContent = player.lines;
}

// Funksjon som lar spilleren falle raskere
function playerDrop() {
    player.pos.y++;
    if (collide(arena, player)) {
        player.pos.y--;
        merge(arena, player);
        clearLines();
        playerReset();  // Tilbakestill spilleren
    }
    dropCounter = 0;
}

// Funksjon som starter spillet
function startGame() {
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('gameOverScreen').style.display = 'none';
    document.getElementById('gameContainer').style.display = 'block';
    arena = createMatrix(12, 20);  // Start ny arena
    player.score = 0;
    player.lines = 0;
    player.level = 1;
    dropInterval = 1000;
    playerReset();
    update();
}

// Funksjon som starter på nytt
function restartGame() {
    startGame();
}

// Funksjon som avslutter spillet
function endGame() {
    document.getElementById('gameContainer').style.display = 'none';
    document.getElementById('gameOverScreen').style.display = 'block';
}

// EventListener som reagerer på tastetrykk for å flytte eller rotere brikken
document.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') player.pos.x -= 1;  // Venstre pil
    if (event.key === 'ArrowRight') player.pos.x += 1;  // Høyre pil
    if (event.key === 'ArrowDown') playerDrop();  // Ned pil (faller raskt)
    if (event.key === 'ArrowUp') playerRotate(1);  // Opp pil (roter med klokken)

    // Unngå kollisjon etter tastetrykk
    if (collide(arena, player)) {
        if (event.key === 'ArrowLeft') player.pos.x += 1;
        if (event.key === 'ArrowRight') player.pos.x -= 1;
    }
});

// Funksjon som oppdaterer spillet ved hver frame
function update(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;

    dropCounter += deltaTime;
    if (dropCounter > dropInterval) playerDrop();  // Fall brikken raskere

    draw();  // Tegn brettet
    requestAnimationFrame(update);  // Oppdater for neste frame
}
