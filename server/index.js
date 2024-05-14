// Importation des modules nécessaires
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import adminRouter from "./Routes/AdminRoutes.js"; // Assurez-vous que le chemin et le nom d'importation sont corrects

// Création de l'application Express
const app = express();

// Utilisation de CORS pour permettre les requêtes cross-origin
app.use(cors());

// Middleware pour parser le JSON
app.use(express.json());
app.use('/auth', adminRouter);

// Création du serveur HTTP à partir de l'application Express
const server = createServer(app);

// Démarrage du serveur sur le port 3000
server.listen(3000, () => {
    console.log('Serveur démarré sur http://localhost:3000');
});