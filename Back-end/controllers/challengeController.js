const pool = require('../db');

const challengeController = {
  // Demande de suppression d'un challenge par son créateur
  requestDeleteChallenge: async (req, res) => {
    const { id } = req.params; // ID du challenge à supprimer
    const { iduser } = req.body; // ID de l'utilisateur qui fait la demande (le créateur)

    try {
      // 1. Vérifier si l'utilisateur est le créateur du challenge
      const challenge = await pool.query(
        'SELECT * FROM challenge WHERE idchall = $1 AND createur = $2',
        [id, iduser]
      );

      if (challenge.rows.length === 0) {
        return res.status(403).json({ message: 'You are not the creator of this challenge or the challenge does not exist' });
      }

      // 2. Marquer le challenge comme "en attente de suppression"
      await pool.query(
        'UPDATE challenge SET pending_deletion = TRUE WHERE idchall = $1',
        [id]
      );

      // 3. Arrêter les nouvelles inscriptions
      await pool.query(
        'UPDATE challenge SET inscription_ouverte = FALSE WHERE idchall = $1',
        [id]
      );

      // Réponse en cas de succès
      res.status(200).json({ message: 'Challenge deletion requested. It will be deleted once all participants have finished.' });
    } catch (error) {
      console.error('Error during challenge deletion request:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
};

module.exports = challengeController;