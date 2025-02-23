const express = require('express');
const authRoutes = require('./routes/authRoutes');
const challengeRoutes = require('./routes/challengeRoutes'); // Importez les routes des challenges
const app = express();
app.use(express.json());
app.use('/auth', authRoutes); // Routes d'authentification
app.use('/challenges', challengeRoutes); // Routes des challenges

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});