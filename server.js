const express = require('express'); 

const sqlite3 = require('sqlite3').verbose(); 

const bcrypt = require('bcrypt'); // Importerer bcrypt for passordhashing 

const session = require('express-session'); // Importerer session for å holde brukeren innlogget 

const bodyParser = require('body-parser'); 

const path = require('path'); 

 

const app = express(); 

const db = new sqlite3.Database('database.db'); 

 

const saltRounds = 10; // Antall salt-runder for bcrypt 

 

// Middleware 

app.set('view engine', 'ejs'); 

app.set('views', path.join(__dirname, 'views')); 

app.use(express.static(path.join(__dirname, 'public'))); 

app.use(bodyParser.urlencoded({ extended: true })); 

 

// Konfigurer session 

app.use(session({ 

    secret: 'hemmelignøkkel', // Endre dette til en mer sikker nøkkel i produksjon 

    resave: false, 

    saveUninitialized: true, 

    cookie: { secure: false } // Settes til true hvis du bruker HTTPS 

})); 

 

// Hovedside: viser brukere, innlegg og kommentarer 

app.get('/', (req, res) => { 

    db.all('SELECT * FROM users', (err, users) => { 

        if (err) return res.status(500).send("Database error"); 

 

        db.all('SELECT Posts.*, users.username FROM Posts JOIN users ON Posts.user_id = users.id', (err, posts) => { 

            if (err) return res.status(500).send("Database error"); 

 

            db.all('SELECT Comments.*, users.username FROM Comments JOIN users ON Comments.user_id = users.id', (err, comments) => { 

                if (err) return res.status(500).send("Database error"); 

 

                res.render('index', { user: req.session.user, users, posts, comments }); 

            }); 

        }); 

    }); 

}); 

 

// ✅ Registrer ny bruker (med bcrypt-passordhashing) 

app.post('/register', async (req, res) => { 

    const { name, username, email, password } = req.body; 

 

    // Sjekk om brukernavnet eller e-posten allerede finnes 

    db.get('SELECT * FROM users WHERE username = ? OR email = ?', [username, email], async (err, user) => { 

        if (user) return res.send("Brukernavn eller e-post er allerede i bruk."); 

 

        // Hash passordet før lagring 

        const hashedPassword = await bcrypt.hash(password, saltRounds); 

 

        db.run('INSERT INTO users (name, username, email, password) VALUES (?, ?, ?, ?)',  

            [name, username, email, hashedPassword],  

            (err) => { 

                if (err) return res.status(500).send("Feil ved oppretting av bruker."); 

                res.redirect('/'); 

            } 

        ); 

    }); 

}); 

 

// ✅ Innlogging (med bcrypt-passordsjekk) 

app.post('/login', (req, res) => { 

    const { username, password } = req.body; 

 

    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => { 

        if (!user) return res.send("Feil brukernavn eller passord."); 

 

        // Sammenlign passord med bcrypt 

        const match = await bcrypt.compare(password, user.password); 

        if (!match) return res.send("Feil brukernavn eller passord."); 

 

        // Lagre bruker i session 

        req.session.user = user; 

        res.redirect('/'); 

    }); 

}); 

 

// ✅ Logg ut 

app.post('/logout', (req, res) => { 

    req.session.destroy(() => { 

        res.redirect('/'); 

    }); 

}); 

 

// ✅ Legg til et nytt innlegg (kun for innloggede brukere) 

app.post('/add-post', (req, res) => { 

    if (!req.session.user) return res.status(401).send("Du må være innlogget for å poste."); 

 

    const { title, content } = req.body; 

    db.run('INSERT INTO Posts (user_id, title, content) VALUES (?, ?, ?)',  

        [req.session.user.id, title, content],  

        (err) => { 

            if (err) return res.status(500).send("Feil ved lagring av innlegg."); 

            res.redirect('/'); 

        } 

    ); 

}); 

 

// ✅ Legg til en kommentar (kun for innloggede brukere) 

app.post('/add-comment', (req, res) => { 

    if (!req.session.user) return res.status(401).send("Du må være innlogget for å kommentere."); 

 

    const { post_id, comment } = req.body; 

    db.run('INSERT INTO Comments (post_id, user_id, comment) VALUES (?, ?, ?)',  

        [post_id, req.session.user.id, comment],  

        (err) => { 

            if (err) return res.status(500).send("Feil ved lagring av kommentar."); 

            res.redirect('/'); 

        } 

    ); 

}); 

 

// Starter serveren 

const PORT = 3000; 

app.listen(PORT, () => { 

    console.log(`Server kjører på http://localhost:${PORT}`); 

}); 