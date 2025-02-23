const express = require('express');
const challengeController = require('../controllers/challengeController'); // Importez le contrôleur des challenges
const router = express.Router();

// Route pour supprimer un challenge
router.delete('/:id', challengeController.deleteChallenge);
module.exports = router;