const pool = require('../db');
const bcrypt = require('bcrypt');

const authController = {
  // Connexion d'un utilisateur
  signIn: async (req, res) => {
    
      const { usernameOrEmail, motdepasse } = req.body;
  
      try {
          // Vérifier si les champs sont fournis
          if (!usernameOrEmail || !motdepasse) {
              return res.status(400).json({ message: "Username or email and password are required!" });
          }
          
          // Vérifier si l'utilisateur existe
          const user = await pool.query(
              'SELECT * FROM utilisateur WHERE username = $1 OR email = $1',
              [usernameOrEmail]
          );
  
               // Comparer le mot de passe avec bcrypt
               const validPassword = await bcrypt.compare(motdepasse, user.rows[0].motdepasse);
  
          // Vérifier si l'utilisateur a été trouvé
          if (user.rows.length === 0 || !validPassword) {
              return res.status(401).json({ message: 'Invalid username or password' });
          }
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
     // les champs obligatoire sont 
       if(!username || !email || !motdepasse){
         return  res.status(401).json({
            msg:'username && email && modepasse are required !!!'
          })
       }
      if (userExists.rows.length > 0) {
        return res.status(400).json({ message: 'Username or email already exists' });
      }

      // pour la securite en hash le modepasse de utilisateur
      const salt=await bcrypt.genSalt(10);
      const hashedmodepass= await bcrypt.hash(motdepasse,salt);
      // Insérer le nouvel utilisateur dans la base de données
      const newUser = await pool.query(
        'INSERT INTO utilisateur (username, nom, prenom, email, motdepasse) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [username, nom, prenom, email, hashedmodepass]
      );

      res.status(201).json({ message: 'User created successfully', user: newUser.rows[0] });
    } catch (error) {
      console.error('Error during sign up:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
};

module.exports = authController;