// Funksjon for å lage en tabell
function lagTabell(tabellId) {
  const tabell = document.getElementById(tabellId);

  // Generer radene
  for (let rad = 0; rad < 8; rad++) {
    const nyRad = tabell.insertRow();

    // Generer kolonnene
    for (let kolonne = 0; kolonne < 4; kolonne++) {
      const celle = nyRad.insertCell();

      // Øverste raden (kolonneoverskrifter)
      if (rad === 0) {
        if (kolonne === 0) {
          celle.innerText = "";  // Kolonne 1 navn
        } else if (kolonne === 1) {
          celle.innerText = "Gram";  // Kolonne 2 navn
        } else if (kolonne === 2) {
          celle.innerText = "Kommentar";  // Kolonne 3 
        } else if (kolonne === 3) {
          celle.innerText = "Antall i familien";  // Kolonne 4 navn
        }
        celle.style.backgroundColor = "#ddd";
        celle.style.fontWeight = "bold";
      }
      // Første kolonne (radoverskrifter)
      else if (kolonne === 0) {
        // Endre radnavn
        if (rad === 1) {
          celle.innerText = "Mandag";  // Rad 1 navn
        } else if (rad === 2) {
          celle.innerText = "Tirsdag";  // Rad 2 navn
        } else if (rad === 3) {
          celle.innerText = "Onsdag";  // Rad 3 navn
        } else if (rad === 4) {
          celle.innerText = "Torsdag";  // Rad 4 navn
        } else if (rad === 5) {
          celle.innerText = "Fredag";  // Rad 5 navn
        } else if (rad === 6) {
          celle.innerText = "Lørdag";  // Rad 6 navn
        } else if (rad === 7) {
          celle.innerText = "Søndag";  // Rad 7 navn
        }
        celle.style.backgroundColor = "#ddd";
        celle.style.fontWeight = "bold";
      }
      // Redigerbare celler for øvrige kolonner
      else {
        celle.classList.add("redigerbar");
        celle.contentEditable = true;  // Gjør cellene redigerbare
        celle.innerText = "";
      }
    }
  }

  // Legg til en ekstra rad nederst for å vise summen
  const sumRad = tabell.insertRow();
  for (let kolonne = 0; kolonne < 4; kolonne++) {
    const celle = sumRad.insertCell();
    if (kolonne === 3) {
      celle.innerText = "Sum:";
      celle.style.fontWeight = "bold";
    } else {
      celle.innerText = "";
    }
  }
}

// Funksjon for å beregne summen for Uke 1 eller Uke 2 (bare for kolonne 2)
function beregnSum(tabellId) {
  const tabell = document.getElementById(tabellId);
  let totalSum = 0;

  // Iterer gjennom radene (fra rad 1 til rad 7) og kolonne 1 (for "g")
  for (let rad = 1; rad < 8; rad++) {
    const celle = tabell.rows[rad].cells[1]; // Kolonne 2 (indeks 1) er "g"
    const verdi = parseFloat(celle.innerText) || 0; // Hent verdien fra celle
    totalSum += verdi;
  }

  // Vis resultatet i den nederste raden (kolonne 3)
  tabell.rows[8].cells[3].innerText = "Sum: " + totalSum;
}

// Generer tabeller
lagTabell("tabell1");
lagTabell("tabell2");
