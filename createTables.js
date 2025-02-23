const pool = require('./db');

(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS utilisateur (
        iduser INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        nom VARCHAR(50),
        prenom VARCHAR(50),
        email VARCHAR(100) UNIQUE NOT NULL,
        motdepasse VARCHAR(100) NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS challenge (
        idchall INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        nom VARCHAR(100) NOT NULL,
        description TEXT,
        dailytask TEXT,
        dure INT,
        createur INT REFERENCES utilisateur(iduser)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS participation (
        idutilisateur INT REFERENCES utilisateur(iduser),
        idchallenge INT REFERENCES challenge(idchall),
        progress BOOLEAN[] DEFAULT '{}',
        date_debut TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        statut VARCHAR(10) NOT NULL DEFAULT 'ongoing',
        CHECK (statut IN ('ongoing','finished','stopped')),
        PRIMARY KEY (idutilisateur, idchallenge)
      );
    `);

    console.log('Tables créées avec succès !');
  } catch (error) {
    console.error('Erreur lors de la création des tables :', error);
  } finally {
    pool.end();
  }
})();
