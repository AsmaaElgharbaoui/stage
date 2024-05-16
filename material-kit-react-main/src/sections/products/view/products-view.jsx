import axios from "axios";
import React, { useState, useEffect } from "react";

import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import Button from "@mui/material/Button";
import TableRow from "@mui/material/TableRow";
import MenuItem from "@mui/material/MenuItem";
import Container from "@mui/material/Container";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

export default function ProductsView() {
  const [numSalle, setNumSalle] = useState("");
  const [capacite, setCapacite] = useState("");
  const [etage, setEtage] = useState("");
  const [specialites, setSpecialites] = useState([]);
  const [nomSpecialite, setNomSpecialite] = useState("");
  const [salles, setSalles] = useState([]);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchSpecialites = async () => {
      try {
        const response = await axios.get("http://localhost:3000/auth/specialites");
        setSpecialites(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des spécialités:", error);
      }
    };

    const fetchSalles = async () => {
      try {
        const response = await axios.get("http://localhost:3000/auth/Rooms");
        setSalles(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des salles:", error);
      }
    };

    fetchSpecialites();
    fetchSalles();
  }, []);

  const validateField = (name, value) => {
    switch (name) {
      case 'numSalle':
        if (!value.trim()) {
          return 'Ce champ est requis';
        }
        break;
      case 'capacite':
        if (!value.trim()) {
          return 'Ce champ est requis';
        }
        break;
      case 'etage':
        if (!value) {
          return 'Ce champ est requis';
        }
        break;
      case 'nomSpecialite':
        if (!value) {
          return 'Ce champ est requis';
        }
        break;
      default:
        return '';
    }
    return '';
  };

  const handleNumSalleChange = (event) => {
    const { value } = event.target;
    setNumSalle(value);
  };

  const handleCapaciteChange = (event) => {
    const { value } = event.target;
    setCapacite(value);
  };

  const handleEtageChange = (event) => {
    const { value } = event.target;
    setEtage(value);
  };

  const handleSpecialiteChange = (event) => {
    const { value } = event.target;
    setNomSpecialite(value);
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    const error = validateField(name, value);
    setFormErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleAdd = async () => {
    const formData = {
      numSalle,
      capacite,
      etage,
      nomSpecialite
    };

    const errors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) {
        errors[key] = error;
      }
    });

    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      try {
        const response = await axios.post("http://localhost:3000/auth/salles", {
          num_salle: numSalle,
          capacite,
          etage,
          nom_specialite: nomSpecialite
        });

        setSalles([...salles, response.data]);

        setNumSalle("");
        setCapacite("");
        setEtage("");
        setNomSpecialite("");
      } catch (error) {
        console.error("Erreur lors de l'ajout de la salle:", error);
      }
    }
  };

  const handleUpdate = async () => {
    try {
      const salleToUpdate = salles[selectedRowIndex];
      if (!salleToUpdate) {
        console.error("La salle à modifier n'a pas été trouvée.");
        return;
      }
      const { id } = salleToUpdate;

      await axios.put(`http://localhost:3000/auth/salles/${id}`, {
        num_salle: numSalle,
        capacite,
        etage,
        nom_specialite: nomSpecialite
      });

      const updatedSalles = [...salles];
      updatedSalles[selectedRowIndex] = {
        ...updatedSalles[selectedRowIndex],
        num_salle: numSalle,
        capacite,
        etage,
        nom_specialite: nomSpecialite
      };

      setSalles(updatedSalles);

      setSelectedRowIndex(null);
      setNumSalle("");
      setCapacite("");
      setEtage("");
      setNomSpecialite("");
    } catch (error) {
      console.error("Erreur lors de la modification de la salle:", error);
    }
  };

  const handleEdit = (index) => {
    const salleToEdit = salles[index];
    if (salleToEdit) {
      const { num_salle,capacite: edcapacite,etage: edetage, nom_specialite } = salleToEdit;
      setNumSalle(num_salle);
      setCapacite(edcapacite);
      setEtage(edetage);
      setNomSpecialite(nom_specialite);
      setSelectedRowIndex(index);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/auth/salles/${id}`);
      setSalles(salles.filter(salle => salle.id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression de la salle:", error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Gestion des Salles
      </Typography>

      <form onSubmit={(event) => event.preventDefault()}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Numéro de salle"
              value={numSalle}
              onBlur={handleBlur}
              onChange={handleNumSalleChange}
              fullWidth
              type="number"
              error={!!formErrors.numSalle}
              helperText={formErrors.numSalle}
              name="numSalle"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Capacité de la salle"
              value={capacite}
              onBlur={handleBlur}
              onChange={handleCapaciteChange}
              type="number"
              fullWidth
              error={!!formErrors.capacite}
              helperText={formErrors.capacite}
              name="capacite"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              select
              label="Étage"
              value={etage}
              onBlur={handleBlur}
              onChange={handleEtageChange}
              fullWidth
              error={!!formErrors.etage}
              helperText={formErrors.etage}
              name="etage"
            >
              {[1, 2, 3].map((floor) => (
                <MenuItem key={floor} value={floor}>
                  Étage {floor}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              select
              label="Spécialité"
              value={nomSpecialite}
              onBlur={handleBlur}
              onChange={handleSpecialiteChange}
              fullWidth
              error={!!formErrors.nomSpecialite}
              helperText={formErrors.nomSpecialite}
              name="nomSpecialite"
            >
              {specialites.map((specialiteItem) => (
                <MenuItem key={specialiteItem.id} value={specialiteItem.nom_specialite}>
                  {specialiteItem.nom_specialite}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={2}>
            <Button type="button" variant="contained" color="primary" fullWidth onClick={handleAdd}>
              Ajouter
            </Button>
          </Grid>
          <Grid item xs={2}>
            <Button
              type="button"
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleUpdate}
            >
              Modifier
            </Button>
          </Grid>
        </Grid>
      </form>

      <div>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Numéro de salle</TableCell>
              <TableCell>Capacité de la salle</TableCell>
              <TableCell>Étage</TableCell>
              <TableCell>Spécialité</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {salles.map((salle, index) => (
              <TableRow key={salle.id}>
                <TableCell>{salle.num_salle}</TableCell>
                <TableCell>{salle.capacite}</TableCell>
                <TableCell>{salle.etage}</TableCell>
                <TableCell>{salle.nom_specialite}</TableCell>
                <TableCell>
                  <Button variant="outlined" color="primary" onClick={() => handleEdit(index)}>
                    Modifier
                  </Button>
                  <Button variant="outlined" color="secondary" onClick={() => handleDelete(salle.id)}>
                    Supprimer
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Container>
  );
}
