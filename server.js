require("dotenv").config(); // Laster miljøvariabler fra en .env-fil.
const express = require("express"); // Importerer Express for å lage serveren.
const bcrypt = require("bcrypt"); // Importerer bcrypt for å hashe passord.
const bodyParser = require("body-parser"); // Middleware for å håndtere POST-data.
const session = require("express-session"); // Importerer session for å håndtere brukerøkter.
const db = require("./DB"); // Importerer SQLite-databaseforbindelsen fra en egen fil.
const path = require("path"); // Importerer path for å håndtere fil- og mappestier.

const app = express(); // Oppretter en Express-app.
const PORT = 3000; // Setter porten serveren skal kjøre på.

// Middleware
app.use(bodyParser.urlencoded({ extended: true })); 
// Håndterer URL-kodede data fra skjemaer.

app.use('/public', express.static(path.join(__dirname, 'public'))); 
// Setter opp en statisk mappe for CSS, bilder osv.

app.set("view engine", "ejs"); 
// Setter EJS som visningsmotor for å rendere HTML-sider.

app.use(
  session({
    secret: "hemmelignøkkel", // Nøkkel for å signere session-data.
    resave: false, // Hindrer at session-data lagres på nytt hvis det ikke er endret.
    saveUninitialized: true, // Lagre nye sessioner selv om de ikke er modifisert.
  })
);

// 📌 Rute: Hovedside (Login)
app.get("/", (req, res) => {
  res.render("login", { message: "" }); 
  // Rendrer login.ejs og sender en tom melding som standard.
});

// 📌 Rute: Registrering
app.get("/register", (req, res) => {
  res.render("register"); 
  // Rendrer register.ejs for å vise registreringsskjemaet.
});

// 📌 Håndter registrering (lagrer bruker i SQLite)
app.post("/register", async (req, res) => {
  const { username, password } = req.body; // Henter brukernavn og passord fra skjemaet.
  const saltRounds = 12; // Antall runder for hashing.

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds); 
    // Hasher passordet med bcrypt.

    db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
      if (user) {
        return res.render("register", { message: "Brukernavnet er allerede tatt!" }); 
        // Viser feilmelding hvis brukernavnet allerede finnes.
      }

      db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword], (err) => {
        if (err) {
          console.error("Feil ved registrering:", err.message); 
          // Logger feil hvis noe går galt.
          return res.send("Feil ved registrering.");
        }
        res.redirect("/"); 
        // Omdirigerer til hovedsiden etter vellykket registrering.
      });
    });
  } catch (err) {
    console.error(err); 
    res.send("Feil ved registrering."); 
    // Håndterer eventuelle feil under hashing.
  }
});

// 📌 Håndter innlogging (verifiserer bruker fra SQLite)
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.get("SELECT * FROM users WHERE username = ?", [username], async (err, user) => {
    if (!user) {
      return res.render("login", { message: "Brukeren finnes ikke!" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (match) {
      req.session.user = user;
      res.send(`<h2>Velkommen, ${username}!</h2><a href='/logout'>Logg ut</a>`);
    } else {
      res.render("login", { message: "Feil passord!" });
    }
  });
});

// 📌 Logg ut
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

// Start serveren
app.listen(PORT, () => {
  console.log(`Server kjører på http://localhost:${PORT}`);
});
