const cron = require('node-cron'); // Importez node-cron
const pool = require('./db'); // Importez la connexion à la base de données
//Tâche planifiée pour vérifier les challenges en attente de suppression
cron.schedule('*/5 * * * *', async () => {
  try {
    // 1. Récupérer les challenges en attente de suppression
    const challenges = await pool.query(
      'SELECT * FROM challenge WHERE pending_deletion = TRUE'
    );

    for (const challenge of challenges.rows) {
      const { idchall } = challenge;

      // 2. Vérifier si tous les participants ont terminé
      const participantsNotFinished = await pool.query(
        'SELECT * FROM participation WHERE idchallenge = $1 AND statut != $2',
        [idchall, 'finished']
      );

      if (participantsNotFinished.rows.length === 0) {
        // 3. Supprimer les inscriptions associées au challenge
        await pool.query('DELETE FROM participation WHERE idchallenge = $1', [idchall]);

        // 4. Supprimer le challenge lui-même
        await pool.query('DELETE FROM challenge WHERE idchall = $1', [idchall]);

        console.log(`Challenge ${idchall} deleted successfully.`);
      }
    }
  } catch (error) {
    console.error('Error during challenge deletion check:', error);
  }
});

