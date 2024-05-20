import axios from 'axios';
import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Radio from '@mui/material/Radio';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import FormLabel from '@mui/material/FormLabel';
import Typography from '@mui/material/Typography';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';

import Iconify from 'src/components/iconify';

import {
  validateAge,
  validateCine,
  validateRoom,
  validateEmail,
  validateGender,
  validateAddress,
  validatePatient,
  validateLastName,
  validateBirthdate,
  validateFirstName,
  validateSpeciality,
  validatePhoneNumber,
  validateAppointmentDate,

} from './validation';


export default function BlogView() {
  const [formData, setFormData] = useState({
    cine: '',
    email: '',
    firstName: '',
    lastName: '',
    birthdate: '',
    age: '',
    region: '',
    address: '',
    phoneNumber: '',
    gender: '',
    speciality: '',
    room: '',
    patient: '',
    appointment_date: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [villes, setVilles] = useState([]);
  const [specialities, setSpecialities] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [step, setStep] = useState(1);
  const [appointments, setAppointments] = useState([]);
  console.log(appointments);

  useEffect(() => {

  
    const fetchVilles = async () => {
      try {
        const response = await fetch('http://localhost:3000/auth/villes');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setVilles(data);
      } catch (error) {
        console.error('Could not fetch the cities:', error);
      }
    };

    const fetchSpecialities = async () => {
      try {
        const response = await axios.get('http://localhost:3000/auth/specialites');
        console.log('Specialities:', response.data); // Log the specialities
        setSpecialities(response.data);
      } catch (error) {
        console.error('Could not fetch the specialities:', error);
      }
    };

    fetchVilles();
    fetchSpecialities();
  }, []);

  const fetchRooms = async (speciality) => {
    try {
      const response = await axios.get(`http://localhost:3000/auth/salle?nom_specialite=${speciality}`);
      console.log('Rooms:', response.data); // Log the rooms
      setRooms(response.data);
    } catch (error) {
      console.error('Could not fetch the rooms:', error);
    }
  };
  

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'speciality') {
      fetchRooms(value);
    }
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    const error = validateField(name, value);
    setFormErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'cine':
        return validateCine(value);
      case 'email':
        return validateEmail(value);
      case 'firstName':
        return validateFirstName(value);
      case 'lastName':
        return validateLastName(value);
      case 'birthdate':
        return validateBirthdate(value);
      case 'age':
        return validateAge(value);
      case 'address':
        return validateAddress(value);
      case 'phoneNumber':
        return validatePhoneNumber(value);
      case 'gender':
        return validateGender(value);
      case 'speciality':
        return validateSpeciality(value);
      case 'room':
        return validateRoom(value);
      case 'patient':
        return validatePatient(value);
      case 'appointment_date':
        return validateAppointmentDate(value);
      default:
        return '';
    }
  };

  const validateStep1 = () => {
    const errors = {};
    const fields = ['cine', 'email', 'firstName', 'lastName', 'birthdate', 'age', 'region', 'address', 'phoneNumber', 'gender'];
    fields.forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        errors[field] = error;
      }
    });
    return errors;
  };

  const validateStep2 = () => {
    const errors = {};
    const fields = ['speciality', 'room', 'patient', 'appointment_date'];
    fields.forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        errors[field] = error;
      }
    });
    return errors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let errors = {};
    if (step === 1) {
      errors = validateStep1();
    } else if (step === 2) {
      errors = validateStep2();
    }
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      if (step === 1) {
        try {
          const response = await axios.post('http://localhost:3000/auth/patients', formData);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          console.log('Data from server:', data);
        } catch (error) {
          console.error('Error while submitting form:', error);
          // Afficher un message d'erreur à l'utilisateur
        }
        // Stockez la valeur de "cine" dans "patient"
        setFormData(prev => ({
          ...prev,
          patient: prev.cine
        }));
        setStep(2);
      } else {
        // Handle final form submission
        addAppointment();
      }
    } else {
      console.log('Errors:', errors);
    }
  };

  const handleBirthdateChange = (event) => {
    const birthdateValue = event.target.value;
    setFormData({
      ...formData,
      birthdate: birthdateValue,
      age: calculateAge(birthdateValue)
    });
  };

  const calculateAge = (birthdate) => {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age -= 1;
    }
    return age.toString();
  };

  const addAppointment = async () => {
    try {
      const response = await axios.post('http://localhost:3000/auth/rdv', formData);
      console.log('Appointment added:', response.data);
      // Mettre à jour la liste des rendez-vous avec le nouveau rendez-vous ajouté
      setAppointments(prevAppointments => [...prevAppointments, response.data]);
      // Autres actions après l'ajout du rendez-vous, par exemple, afficher un message de succès
    } catch (error) {
      console.error('Error adding appointment:', error);
      // Afficher un message d'erreur à l'utilisateur
    }
  };
  
  const handleReset = () => {
    setFormData({
      cine: '',
      email: '',
      firstName: '',
      lastName: '',
      birthdate: '',
      age: '',
      region: '',
      address: '',
      phoneNumber: '',
      gender: '',
      speciality: '',
      room: '',
      patient: '',
      appointment_date: ''
    });
    setFormErrors({});
    setStep(1);
  };

  const handlePrevious = () => {
    setStep(1);
  };

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Appointments</Typography>
      </Stack>
      <Box component="form" noValidate autoComplete="off" >
        {step === 1 ? (
          <>
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
            <TextField
              fullWidth
              name="cine"
              label="CINE *"
              variant="outlined"
              margin="normal"
              onChange={handleChange}
              onBlur={handleBlur}
              value={formData.cine}
              error={!!formErrors.cine}
              helperText={formErrors.cine}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="eva:person-fill" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              name="email"
              label="Email Address *"
              variant="outlined"
              margin="normal"
              onChange={handleChange}
              onBlur={handleBlur}
              value={formData.email}
              error={!!formErrors.email}
              helperText={formErrors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="ic:outline-email" />
                  </InputAdornment>
                ),
              }}
            />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="firstName"
                  label="First Name *"
                  variant="outlined"
                  margin="normal"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={formData.firstName}
                  error={!!formErrors.firstName}
                  helperText={formErrors.firstName}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Iconify icon="bi:person-fill" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="lastName"
                  label="Last Name *"
                  variant="outlined"
                  margin="normal"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={formData.lastName}
                  error={!!formErrors.lastName}
                  helperText={formErrors.lastName}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Iconify icon="bi:person-fill" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="birthdate"
                  type="date"
                  label="Date of Birth *"
                  variant="outlined"
                  margin="normal"
                  onChange={handleBirthdateChange}
                  onBlur={handleBlur}
                  value={formData.birthdate}
                  InputLabelProps={{ shrink: true }}
                  error={!!formErrors.birthdate}
                  helperText={formErrors.birthdate}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Iconify icon="fa-solid:birthday-cake" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="age"
                  label="Age *"
                  variant="outlined"
                  margin="normal"
                  type="number"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={formData.age}
                  error={!!formErrors.age}
                  helperText={formErrors.age}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Iconify icon="ic:outline-person" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
            <TextField
              select
              fullWidth
              label="Region *"
              name="region"
              value={formData.region}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!formErrors.region}
              helperText={formErrors.region}
              variant="outlined"
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="ic:outline-location-on" />
                  </InputAdornment>
                ),
              }}
            >
              {villes.map((ville) => (
                <MenuItem key={ville} value={ville}>
                  {ville}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              name="address"
              label="Address *"
              variant="outlined"
              margin="normal"
              onChange={handleChange}
              onBlur={handleBlur}
              value={formData.address}
              error={!!formErrors.address}
              helperText={formErrors.address}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="fluent:home-28-regular" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              name="phoneNumber"
              label="Phone Number *"
              variant="outlined"
              margin="normal"
              onChange={handleChange}
              onBlur={handleBlur}
              value={formData.phoneNumber}
              error={!!formErrors.phoneNumber}
              helperText={formErrors.phoneNumber}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="carbon:phone-filled" />
                  </InputAdornment>
                ),
              }}
            />
            <FormControl component="fieldset" margin="normal" fullWidth>
              <FormLabel component="legend">Gender *</FormLabel>
              <RadioGroup row name="gender" value={formData.gender} onChange={handleChange}>
                <FormControlLabel value="female" control={<Radio />} label="Female" />
                <FormControlLabel value="male" control={<Radio />} label="Male" />
              </RadioGroup>
            </FormControl>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button type="button" variant="outlined" color="secondary" onClick={handleReset}>
                Clear
              </Button>
              <Button  onClick={handleSubmit} type="submit" variant="contained" color="primary">
                  Next
              </Button>

            </Stack>
          </>
        ) : (
          <>
            <Typography variant="h6" gutterBottom>
              Appointment Details
            </Typography>
            <TextField
              select
              fullWidth
              name="speciality"
              label="Speciality *"
              variant="outlined"
              margin="normal"
              onChange={handleChange}
              onBlur={handleBlur}
              value={formData.speciality}
              error={!!formErrors.speciality}
              helperText={formErrors.speciality}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="mdi:medical-bag" />
                  </InputAdornment>
                ),
              }}
            >
              {specialities.map((speciality) => (
                <MenuItem key={speciality.nom_specialite} value={speciality.nom_specialite}>
                  {speciality.nom_specialite}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              fullWidth
              name="room"
              label="Room *"
              variant="outlined"
              margin="normal"
              onChange={handleChange}
              onBlur={handleBlur}
              value={formData.room}
              error={!!formErrors.room}
              helperText={formErrors.room}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="ic:outline-room" />
                  </InputAdornment>
                ),
              }}
            >
              {rooms.map((room) => (
                <MenuItem key={room.num_salle} value={room.num_salle}>
                  {room.num_salle}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              name="patient"
              label="Patient *"
              variant="outlined"
              margin="normal"
              onChange={handleChange}
              onBlur={handleBlur}
              value={formData.patient}
              error={!!formErrors.patient}
              helperText={formErrors.patient}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="ic:outline-person" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              name="appointment_date"
              type="datetime-local"
              label="Date of Appointment *"
              variant="outlined"
              margin="normal"
              onChange={handleChange}
              onBlur={handleBlur}
              value={formData.appointment_date}
              InputLabelProps={{ shrink: true }}
              error={!!formErrors.appointment_date}
              helperText={formErrors.appointment_date}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="mdi:calendar-clock" />
                  </InputAdornment>
                ),
              }}
            />
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button type="button" variant="outlined" color="secondary" onClick={handlePrevious}>
                Previous
              </Button>
              <Button  onClick={addAppointment} type="submit" variant="contained" color="primary">
                Save
              </Button>
            </Stack>
          </>
        )}
      </Box>
    </Container>
  );
}