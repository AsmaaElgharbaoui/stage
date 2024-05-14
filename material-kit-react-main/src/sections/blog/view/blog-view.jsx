import  Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Radio from '@mui/material/Radio';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import FormLabel from '@mui/material/FormLabel';
import Typography from '@mui/material/Typography';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl'; 
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function BlogView() {
  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Apointments</Typography>
        <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />}>
          New appointment
        </Button>
      </Stack>

      <Box component="form" noValidate autoComplete="off">
        <Typography variant="h6" gutterBottom>
        personal informations
        </Typography>
        <TextField
          fullWidth
          disabled
          label="Company (disabled)"
          variant="outlined"
          margin="normal"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="ic:baseline-business" />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          fullWidth
          label="Username"
          variant="outlined"
          margin="normal"
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
          label="Email address"
          variant="outlined"
          margin="normal"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="ic:outline-email" />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          fullWidth
          label="First Name"
          variant="outlined"
          margin="normal"
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
          label="Last Name"
          variant="outlined"
          margin="normal"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:person-fill" />
              </InputAdornment>
            ),
          }}
        />
        <FormControl component="fieldset" margin="normal" fullWidth>
          <FormLabel component="legend">Sexe du patient</FormLabel>
          <RadioGroup row>
            <FormControlLabel value="female" control={<Radio />} label="Femme" />
            <FormControlLabel value="male" control={<Radio />} label="Homme" />
          </RadioGroup>
        </FormControl>
        <Button variant="contained" color="primary">
          Update Profile
        </Button>
      </Box>
    </Container>
  );
}