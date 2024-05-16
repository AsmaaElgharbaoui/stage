import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Radio from '@mui/material/Radio';
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

const validateField = (name, value) => {
  if (!value.trim()) {
    return 'Ce champ est requis';
  }
  return '';
};

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
    gender: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [villes, setVilles] = useState([]);

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
    fetchVilles();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    const error = validateField(name, value);
    setFormErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
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
        const response = await fetch('http://localhost:3000/auth/patients', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Data from server:', data);
        // Afficher un message de succès ou rediriger l'utilisateur vers une autre page, etc.
      } catch (error) {
        console.error('Error while submitting form:', error);
        // Afficher un message d'erreur à l'utilisateur
      }
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
      gender: ''
    });
    setFormErrors({});
  };

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Appointments</Typography>
        <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleSubmit}>
          New appointment
        </Button>
      </Stack>
      <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
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
          <Button type="submit" variant="contained" color="primary">
            Next
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}