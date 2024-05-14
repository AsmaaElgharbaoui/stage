import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  user: 'postgres',    
  host: 'localhost',             
  database: 'stage_cd',   
  password: 'asmae1234', 
  port: 5432,                    
});

pool.on('connect', () => {
  console.log('Connexion à la base de données établie avec succès.');
});

pool.on('error', (err) => {
  console.error('Erreur de connexion à la base de données:', err);
});
const testConnection = async () => {
    try {
      const { rows } = await pool.query('SELECT NOW()');
      console.log('Heure actuelle sur le serveur PostgreSQL:', rows[0].now);
    } catch (error) {
      console.error('Échec lors du test de connexion:', error);
    }
  };
  const getUtilisateurs = async () => {
    try {
      const { rows } = await pool.query('SELECT * FROM specialite');
      console.log('Données récupérées de la table utilisateurs :', rows);
    } catch (error) {
      console.error('Erreur lors de la récupération des données :', error);
    }
  };

  getUtilisateurs();
  testConnection();
export default pool;