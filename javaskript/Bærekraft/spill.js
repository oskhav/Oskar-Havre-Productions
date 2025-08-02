let score = 0;
let timer = 60;
let interval;

const items = [
    { id: 'item1', src: '../../Bilder/Bærekraft/Melk.png', bin: 'papir' },
    { id: 'item2', src: '../../Bilder/Bærekraft/pose.png', bin: 'plast' },
    { id: 'item3', src: '../../Bilder/Bærekraft/epleskrott.png', bin: 'mat' },
    { id: 'item4', src: '../../Bilder/Bærekraft/glass.webp', bin: 'glass' },
    { id: 'item5', src: '../../Bilder/Bærekraft/354189.jpg', bin: 'papir' },
    { id: 'item6', src: '../../Bilder/Bærekraft/plast.webp', bin: 'plast' },
    { id: 'item7', src: '../../Bilder/Bærekraft/gammel gulrot.avif', bin: 'mat' },
    { id: 'item8', src: '../../Bilder/Bærekraft/syltetøyglass.webp', bin: 'glass' },
    { id: 'item10', src: '../../Bilder/Bærekraft/tørkepapir.png', bin: 'rest' },
    { id: 'item12', src: '../../Bilder/Bærekraft/vaskemidel.png', bin: 'plast' }
];

function startGame() {
    document.getElementById('start-button').style.display = 'none'; // Skjul start-knappen
    document.getElementById('bins').style.display = 'flex'; // Vis søppelbøtter
    document.getElementById('items').style.display = 'flex'; // Vis gjenstander

    const selectedItems = items.sort(() => 0.5 - Math.random()).slice(0, 6); // Velg 6 tilfeldige elementer
    const itemsContainer = document.getElementById('items');
    itemsContainer.innerHTML = '';

    selectedItems.forEach(item => {
        const img = document.createElement('img');
        img.id = item.id;
        img.src = item.src;
        img.className = 'item';
        img.setAttribute('draggable', 'true');
        img.setAttribute('data-bin', item.bin);
        img.setAttribute('ondragstart', 'drag(event)');
        itemsContainer.appendChild(img);
    });

    score = 0;
    timer = 60;
    document.getElementById('score').textContent = score;
    document.getElementById('timer').textContent = timer;

    clearInterval(interval);
    interval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    timer--;
    document.getElementById('timer').textContent = timer;

    if (timer <= 0) {
        clearInterval(interval);
        alert('Game Over! Tiden gikk ut!');
        window.location.href = 'gameover.html'; // Send til Game Over-siden
    }
}

function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function drop(event) {
    event.preventDefault();
    const itemId = event.dataTransfer.getData("text");
    const item = document.getElementById(itemId);
    const bin = event.target.closest('.bin'); // Sørg for at droppet skjer i en "bin"

    if (bin && item.dataset.bin === bin.id) {
        const newItem = item.cloneNode(true);
        newItem.style.margin = "5px";
        newItem.draggable = false;
        newItem.style.border = "3px solid #4CAF50";
        newItem.style.cursor = "default";
        bin.appendChild(newItem);

        item.remove();

        updateScore(10);
    } else {
        item.style.border = "3px solid #E74C3C";
        updateScore(-5);
    }

    // Sjekk om alle elementer er sortert
    if (document.querySelectorAll('.item[draggable="true"]').length === 0) {
        clearInterval(interval);
        alert('Gratulerer! Du sorterte alt riktig!');
        setTimeout(() => {
            window.location.href = 'gratulerer.html'; // Send til Gratulerer-siden
        }, 500); // Kort forsinkelse før siden lastes inn
    }
}

function updateScore(points) {
    score += points;
    document.getElementById('score').textContent = score;
}
