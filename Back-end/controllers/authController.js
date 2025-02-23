const pool = require('../db');
const bcrypt = require('bcrypt');

const authController = {
  // Connexion d'un utilisateur
  signIn: async (req, res) => {
    const { username, email, motdepasse } = req.body;

    try {
      // Vérifier si les champs obligatoires sont fournis
      if ((!username && !email) || !motdepasse) {
        return res.status(400).json({ message: 'Username/email and password are required' });
      }

      // Déterminer si l'utilisateur utilise un username ou un email
      const identifier = username || email;

      // Vérifier si l'utilisateur existe en cherchant par username OU email
      const user = await pool.query(
        'SELECT * FROM utilisateur WHERE username = $1 OR email = $2',
        [identifier, identifier]
      );

      // Si l'utilisateur n'existe pas
      if (user.rows.length === 0) {
        return res.status(401).json({ message: 'Invalid username/email or password' });
      }

      // Comparer le mot de passe haché avec celui fourni
      const validPassword = await bcrypt.compare(motdepasse, user.rows[0].motdepasse);

      // Si le mot de passe est incorrect
      if (!validPassword) {
        return res.status(401).json({ message: 'Invalid username/email or password' });
      }

      // Si tout est valide, renvoyer une réponse réussie
      res.status(200).json({ message: 'Login successful', user: user.rows[0] });
    } catch (error) {
      console.error('Error during sign in:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Inscription d'un nouvel utilisateur
  signUp: async (req, res) => {
    const { username, nom, prenom, email, motdepasse } = req.body;

    try {
      // Vérifier si l'utilisateur ou l'email existe déjà
      const userExists = await pool.query(
        'SELECT * FROM utilisateur WHERE username = $1 OR email = $2',
        [username, email]
      );

      if (userExists.rows.length > 0) {
        return res.status(400).json({ message: 'Username or email already exists' });
      }

      // Hacher le mot de passe
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(motdepasse, salt);

      // Insérer le nouvel utilisateur dans la base de données
      const newUser = await pool.query(
        'INSERT INTO utilisateur (username, nom, prenom, email, motdepasse) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [username, nom, prenom, email, hashedPassword]
      );

      res.status(201).json({ message: 'User created successfully', user: newUser.rows[0] });
    } catch (error) {
      console.error('Error during sign up:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
};

module.exports = authController;