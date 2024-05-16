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
      const user = await pool.query('SELECT * FROM utilisateur WHERE email = $1', [email]);
  
      if (user.rows.length === 0) {
        return res.status(404).send("Utilisateur non trouvé");
      }
      const hashedPassword = user.rows[0].password;
      const isPasswordValid = await bcrypt.compare(password, hashedPassword);
  
      if (!isPasswordValid) {
        return res.status(401).send("Mot de passe incorrect");
      }
      if (user.rows[0].role !== 'admin') {
        return res.status(403).send("Vous n'avez pas les autorisations d'administrateur nécessaires");
      }
      req.session.user = user.rows[0];
      res.status(200).send("Connexion réussie"); // Envoyer un message de succès
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Erreur du serveur');
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

router.put('/salles/:id', async (req, res) => {
    const { id } = req.params;
    const { num_salle, etage, capacite, nom_specialite } = req.body;

    try {
        const specialiteExist = await pool.query('SELECT id_specialite FROM specialite WHERE nom_specialite = $1', [nom_specialite]);
        if (specialiteExist.rows.length === 0) {
            return res.status(404).json({ message: "La spécialité spécifiée n'existe pas." });
        }

        const updateSalle = await pool.query(
            'UPDATE salle SET num_salle = $1, etage = $2, capacite = $3, nom_specialite = $4 WHERE id_salle = $5 RETURNING *',
            [num_salle, etage, capacite, nom_specialite, id]
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

router.post('/salles', async (req, res) => {
    const { num_salle, etage, capacite, nom_specialite } = req.body;
    try {
        const specialiteExist = await pool.query('SELECT id_specialite FROM specialite WHERE nom_specialite = $1', [nom_specialite]);
        if (specialiteExist.rows.length === 0) {
            return res.status(404).json({ message: "La spécialité spécifiée n'existe pas." });
        }

        const id_specialite = specialiteExist.rows[0].id_specialite;

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

router.get('/Rooms', async (req, res) => {
    try {
        const allSalles = await pool.query('SELECT  id_salle, num_salle, etage, capacite, nom_specialite FROM salle');
        res.status(200).json(allSalles.rows);
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

export default router;
