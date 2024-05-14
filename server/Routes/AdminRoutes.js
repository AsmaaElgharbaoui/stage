import express from "express";
import pool from "../utils/db.js";
import bcrypt from 'bcrypt';
import bodyParser from "body-parser";
const router = express.Router();


router.post('/patients', async (req, res) => {
    const { CINE, NOM, PRENOM, DATE_NAISSANCE, TELEPHON, SEXE, ADRESSE, EMAIL } = req.body;
    try {
        const newPatient = await pool.query(
            'INSERT INTO patient (CINE, NOM, PRENOM, DATE_NAISSANCE, TELEPHON, SEXE, ADRESSE, EMAIL) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [CINE, NOM, PRENOM, DATE_NAISSANCE, TELEPHON, SEXE, ADRESSE, EMAIL]
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
        // Vous pouvez ajouter ici un hashage de mot de passe si nécessaire, par exemple avec bcrypt
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await pool.query(
            'INSERT INTO utilisateur (cine, nom, prenom, email, password, statut, role) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [cine, nom, prenom, email, hashedPassword, statut, role]
        );
        res.status(201).json(newUser.rows[0]);
    } catch (err) {
        console.error(err.message);
        if (err.code === '23505') { // Postgres error code for unique violation
            return res.status(409).send("Un utilisateur avec cet email ou CINE existe déjà.");
        }
        res.status(500).send('Server error');
    }
});
router.get('/getUsers', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT cine, nom, prenom, email, statut, role FROM utilisateur'
        );
        if (result.rows.length > 0) {
            res.json(result.rows); // Envoie les données de tous les utilisateurs sans les mots de passe
        } else {
            res.status(404).send("Aucun utilisateur trouvé"); // Gestion du cas où aucun utilisateur n'est trouvé
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
    const { id } = req.params; // ID de la salle à modifier
    const { num_salle, etage, capacite, nom_specialite } = req.body;

    try {
        // Vérification de l'existence de la spécialité
        const specialiteExist = await pool.query('SELECT id_specialite FROM specialite WHERE nom_specialite = $1', [nom_specialite]);
        if (specialiteExist.rows.length === 0) {
            return res.status(404).json({ message: "La spécialité spécifiée n'existe pas." });
        }

        // Mise à jour de la salle
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
        // Vérification de l'existence de la spécialité
        const specialiteExist = await pool.query('SELECT id_specialite FROM specialite WHERE nom_specialite = $1', [nom_specialite]);
        
        // Si la spécialité n'existe pas, renvoyer une erreur
        if (specialiteExist.rows.length === 0) {
            return res.status(404).json({ message: "La spécialité spécifiée n'existe pas." });
        }

        // Insertion de la salle dans la base de données
        const newSalle = await pool.query(
            'INSERT INTO salle (num_salle, etage, capacite, nom_specialite) VALUES ($1, $2, $3, $4) RETURNING *',
            [num_salle, etage, capacite, nom_specialite]
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

export default router;
