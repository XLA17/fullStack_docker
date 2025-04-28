import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

// Page de login
function LoginPage() {
  const [token, setToken] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Hook pour naviguer entre les pages

  const handleSubmit = (event) => {
    event.preventDefault();
  
    // Envoi des données de login via POST
    fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: name, password })  // Changer 'name' en 'username' selon ce que le backend attend
    })
      .then(res => {
        if (!res.ok) {
          // Si la réponse n'est pas ok (status 401 ou autre), renvoyer un message d'erreur
          return res.json().then(data => {
            throw new Error(data.error || 'Unknown error');
          });
        }
        return res.json();
      })
      .then(data => {
        if (data.token) {
          // Enregistres le token dans le localStorage ou dans un state si nécessaire
          setToken(data.token);
          console.log('Token reçu:', data.token);
          setMessage('Login réussi !');
        } else {
          setMessage('Erreur de login');
        }
      })
      .catch(error => {
        console.error('Erreur POST :', error);
        setMessage('Erreur de serveur');
      });
  };

  const fetchProfile = () => {
    // Récupérer le token du localStorage ou de l'état
  
    // Vérifier si le token existe
    if (!token) {
      console.log('Token manquant!');
      return;
    }
  
    // Faire la requête GET avec le token dans l'en-tête Authorization
    console.log('fetchprofile');
    fetch('http://localhost:3000/profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Ajout du token JWT dans l'en-tête
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Réponse du profil:', data);
        // Par exemple, afficher le message
        alert(data.message);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération du profil:', error);
        alert('Erreur lors de la récupération du profil.');
      });
  };
  

  return (
    <div>
      <h1>{message || "Please log in"}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Nom:</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Mot de passe:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Se connecter</button>
      </form>
      <button onClick={fetchProfile}>fetchProfile</button>
      <div>{token}</div>
    </div>
  );
}

function RegisterPage() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Hook pour naviguer entre les pages

  const handleSubmit = (event) => {
    event.preventDefault();

    // Envoi des données de login via POST
    fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: name, password })
    })
      .then(res => res.json())
      .then(data => {
        setMessage(data.message);
        // Naviguer vers la page de message après une connexion réussie
        if (data.message === "Utilisateur enregistré !") {
          navigate('/message'); // Redirige vers la page message
        }
      })
      .catch(error => console.error('Erreur POST :', error));
  };

  return (
    <div>
      <h1>{message || "Please register"}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Nom:</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Mot de passe:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
}

// Page de message après la connexion
function MessagePage() {
  return (
    <div>
      <h1>Bienvenue, vous êtes enregistré!</h1>
      <Link to="/login">Retour à la page de connexion</Link>
    </div>
  );
}

// Composant principal avec la navigation
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/message" element={<MessagePage />} />
      </Routes>
    </Router>
  );
}

export default App;
