// Finn modal-elementene
const modal = document.getElementById('myModal');
const modalImg = document.getElementById('img01');
const closeBtn = document.querySelector('.close');

// Når et bilde i grid-en klikkes på:
document.querySelectorAll('.box4 img').forEach(img => {
  img.addEventListener('click', () => {
    modal.style.display = 'block';
    modalImg.src = img.src;
    modalImg.alt = img.alt; // beholder alt-tekst
  });
});

// Lukk når du klikker på krysset
closeBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

// Lukk også hvis brukeren klikker utenfor bildet
modal.addEventListener('click', e => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});
