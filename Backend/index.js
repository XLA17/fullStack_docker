const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cors = require('cors');

const MorpyamDatabase = require('./Databases/MorpyamDatabase')

const app = express();
const users = []; // Exemple : à remplacer par une base de données

const db = new MorpyamDatabase();

const JWT_SECRET = 'votre_secret_ultra_complexe';

app.use(cors());
app.use(bodyParser.json());

app.get('/api/hello', (req, res) => {
  res.json({ message: "Hello from backend!" });
});

// Inscription
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });

  db.getDate();

  res.json({ message: 'Utilisateur enregistré !' });
});

// Connexion
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log(users);
  const user = users.find(u => u.username === username);
  db.getDate();
  if (!user){
    return res.status(401).json({ error: "User don't exist" });
  } else if (!(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Identifiants invalides' });
  }
  const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token });
});

// Middleware pour routes protégées
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    res.sendStatus(403);
  }
}

// Route protégée
app.get('/profile', authMiddleware, (req, res) => {
  db.getDate();
  res.json({ message: `Bienvenue ${req.user.username}` });
});

app.listen(3000, () => console.log('Serveur lancé sur http://localhost:3000'));
