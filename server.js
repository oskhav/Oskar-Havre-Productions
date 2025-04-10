const express = require("express");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const session = require("express-session");
const db = require("./db"); // Importer SQLite-tilkoblingen
const path = require("path");

const app = express();
const PORT = 3000;

// Sett opp EJS som view engine
app.set("view engine", "ejs");
//app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "hemmelignøkkel",
    resave: false,
    saveUninitialized: true,
  })
);

// 📌 Rute: Hovedside (Login)
app.get("/", (req, res) => {
  res.render("login", { message: "" });
});

// 📌 Rute: Registrering
app.get("/register", (req, res) => {
  res.render("register");
});

// 📌 Håndter registrering (lagrer bruker i SQLite)
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  db.run(
    'INSERT INTO users (username, password) VALUES (?, ?)',
    [username, hashedPassword],
    (err) => {
      if (err) {
        console.error(err.message);
        res.render('registrer', { message: 'Brukernavn er allerede tatt.' });
      } else {
        res.redirect('/login');
      }
    }
  );
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
