import express from "express";
import pool from "../utils/db.js";
import bcrypt from 'bcrypt';
import bodyParser from "body-parser";
const router = express.Router();
import session from 'express-session';

router.use(session({
  secret: 'asmae1234', // Remplacez ceci par une chaîne de caractères aléatoire pour sécuriser votre session
  resave: false,
  saveUninitialized: true
}));

router.use(bodyParser.json());

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const userResult = await pool.query('SELECT * FROM utilisateur WHERE email = $1', [email]);
      const user = userResult.rows[0];
  
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Mot de passe incorrect" });
      }
  
      // Vérifier si le statut de l'utilisateur est actif
      if (user.statut !== 'active') {
        return res.status(403).json({ message: "Utilisateur inactif" });
      }
  
      // Vérifier le rôle de l'utilisateur
      const role = user.role;
      if (role !== 'admin' && role !== 'secretaire') {
        return res.status(403).json({ message: "Rôle utilisateur non géré" });
      }
  
      req.session.user = user;
      const displayName = `${user.nom} ${user.prenom}`;

    res.status(200).json({ message: "Connexion réussie", role: role, displayName: displayName, email: user.email });
  } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Erreur du serveur' });
    }
  });
  




router.get('/checkAdmin', (req, res) => {
    if (req.session.user && req.session.user.role === 'admin') {
      return res.status(200).send("Connecté en tant qu'administrateur");
    } else {
      return res.status(401).send("Non autorisé");
    }
});

router.post('/patients', async (req, res) => {
    const { cine, email, firstName, lastName, birthdate, age, region, address, phoneNumber, gender } = req.body;
    try {
        const newPatient = await pool.query(
            'INSERT INTO patient (cine, email, prenom, nom, date_naissance, age, ville, adresse, telephon, sexe) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
            [cine, email, firstName, lastName, birthdate, age, region, address, phoneNumber, gender]
        );
        res.status(201).json(newPatient.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.get('/patients/names', async (req, res) => {
    try {
        const result = await pool.query('SELECT prenom, nom FROM patient');
        if (result.rows.length > 0) {
            const names = result.rows.map(row => `${row.prenom} ${row.nom}`);
            res.status(200).json(names);
        } else {
            res.status(404).send("Aucun patient trouvé");
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur du serveur');
    }
});

router.post('/utilisateurs', async (req, res) => {
    const { cine, nom, prenom, email, password, statut, role } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await pool.query(
            'INSERT INTO utilisateur (cine, nom, prenom, email, password, statut, role) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [cine, nom, prenom, email, hashedPassword, statut, role]
        );
        res.status(201).json(newUser.rows[0]);
    } catch (err) {
        console.error(err.message);
        if (err.code === '23505') {
            return res.status(409).send("Un utilisateur avec cet email ou CINE existe déjà.");
        }
        res.status(500).send('Server error');
    }
});



router.post('/rdv', async (req, res) => {
    const { speciality, room, patient, appointment_date } = req.body;
    const INSERT_RDV_QUERY = 'INSERT INTO rdv (speciality, room, patient, appointment_date) VALUES ($1, $2, $3, $4) RETURNING *';
    try {
      const { rows } = await pool.query(INSERT_RDV_QUERY, [speciality, room, patient, appointment_date]);
      res.status(201).json({ message: 'RDV créé avec succès', id: rows[0].id });
    } catch (error) {
      console.error('Erreur lors de l\'insertion du RDV:', error);
      res.status(500).json({ error: 'Une erreur s\'est produite lors de l\'insertion du RDV' });
    }
  });


router.put('/utilisateurs/:cine', async (req, res) => {
    const { cine } = req.params;
    const { statut } = req.body;
    try {
        const updatedUser = await pool.query(
            'UPDATE utilisateur SET statut = $1 WHERE cine = $2 RETURNING *',
            [statut, cine]
        );

        if (updatedUser.rows.length === 0) {
            return res.status(404).send("Utilisateur non trouvé");
        }

        res.status(200).json(updatedUser.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.delete('/utilisateurs/:cine', async (req, res) => {
    const { cine } = req.params;
    try {
        const deletedUser = await pool.query(
            'DELETE FROM utilisateur WHERE cine = $1 RETURNING *',
            [cine]
        );
        if (deletedUser.rows.length === 0) {
            return res.status(404).send("Utilisateur non trouvé");
        }
        res.status(200).json({ message: "Utilisateur supprimé avec succès" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.get('/getUsers', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT cine, nom, prenom, email, statut, role FROM utilisateur'
        );
        if (result.rows.length > 0) {
            res.json(result.rows);
        } else {
            res.status(404).send("Aucun utilisateur trouvé");
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur du serveur');
    }
});

router.get('/specialites', async (req, res) => {
    try {
        const allSpecialites = await pool.query('SELECT nom_specialite FROM specialite');
        res.status(200).json(allSpecialites.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.put('/salles/:num_salle', async (req, res) => {
    const { num_salle } = req.params;
    const { etage, capacite, nom_specialite } = req.body;

    try {
        const specialiteExist = await pool.query('SELECT id_specialite FROM specialite WHERE nom_specialite = $1', [nom_specialite]);
        if (specialiteExist.rows.length === 0) {
            return res.status(404).json({ message: "La spécialité spécifiée n'existe pas." });
        }

        const updateSalle = await pool.query(
            'UPDATE salle SET etage = $1, capacite = $2, nom_specialite = $3 WHERE num_salle = $4 RETURNING *',
            [etage, capacite, nom_specialite, num_salle]
        );

        if (updateSalle.rows.length === 0) {
            return res.status(404).send('Salle non trouvée');
        }

        res.status(200).json(updateSalle.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.delete('/salles/:num_salle', async (req, res) => {
    const { num_salle } = req.params;

    try {
        const deleteSalle = await pool.query('DELETE FROM salle WHERE num_salle = $1 RETURNING *', [num_salle]);

        if (deleteSalle.rows.length === 0) {
            return res.status(404).send('Salle non trouvée');
        }

        res.status(200).json({ message: 'Salle supprimée avec succès', salle: deleteSalle.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


router.post('/salles', async (req, res) => {
    const { num_salle, etage, capacite, nom_specialite } = req.body;
    try {
        // Vérification de l'existence de la spécialité et récupération de id_specialite
        const specialiteExist = await pool.query('SELECT id_specialite FROM specialite WHERE nom_specialite = $1', [nom_specialite]);

        // Si la spécialité n'existe pas, renvoyer une erreur
        if (specialiteExist.rows.length === 0) {
            return res.status(404).json({ message: "La spécialité spécifiée n'existe pas." });
        }

        const id_specialite = specialiteExist.rows[0].id_specialite;

        // Insertion de la salle dans la base de données en utilisant id_specialite et nom_specialite
        const newSalle = await pool.query(
            'INSERT INTO salle (num_salle, etage, capacite, nom_specialite, id_specialite) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [num_salle, etage, capacite, nom_specialite, id_specialite]
        );
        res.status(201).json(newSalle.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});
router.get('/villes', async (req, res) => {
    try {
        const result = await pool.query('SELECT nom_ville FROM region');
        if (result.rows.length > 0) {
            const villes = result.rows.map(row => row.nom_ville);
            res.status(200).json(villes);
        } else {
            res.status(404).send("Aucune ville trouvée dans la table region");
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur du serveur');
    }
});
router.get('/salle', async (req, res) => {
    const { nom_specialite } = req.query;
    console.log(`Received request for nom_specialite: ${nom_specialite}`); // Log the received speciality name
    try {
        // Vérification de l'existence des salles pour la spécialité donnée
        const salles = await pool.query('SELECT num_salle FROM salle WHERE nom_specialite = $1', [nom_specialite]);
        
        console.log(`Query result: ${JSON.stringify(salles.rows)}`); // Log the result of the query

        // Si aucune salle n'est trouvée, renvoyer une erreur
        if (salles.rows.length === 0) {
            return res.status(404).json({ message: "Aucune salle trouvée pour la spécialité spécifiée." });
        }

        // Renvoyer les num_salle correspondants
        res.status(200).json(salles.rows);
    } catch (err) {
        console.error('Error executing query:', err.message);
        res.status(500).send('Server error');
    }
});


export default router;
