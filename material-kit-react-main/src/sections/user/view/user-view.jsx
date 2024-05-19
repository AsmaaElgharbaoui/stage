import axios from 'axios';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

import Select from '@mui/material/Select'; // Importer Select
import MenuItem from '@mui/material/MenuItem'; // Importer MenuItem
import FormControl from '@mui/material/FormControl'; // Importer FormControl
import InputLabel from '@mui/material/InputLabel'; // Importer InputLabel
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import TablePagination from '@mui/material/TablePagination';

import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../table-no-data';
import UserTableRow from '../user-table-row';
import UserTableHead from '../user-table-head';
import TableEmptyRows from '../table-empty-rows';
import UserTableToolbar from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

const validateField = (name, value) => {
  if (!value.trim()) {
    return 'Ce champ est requis';
  }
  return '';
};

function NewUserForm({ onClose }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    cine: '',
    email: '',
    password: '',
    role: '',
    status: 'active'
  });
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
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
      console.log('Form is valid, proceed with submitting:', formData);
      try {
        const response = await axios.post('http://localhost:3000/auth/utilisateurs', formData);
        console.log('User created:', response.data);
        onClose();
      } catch (error) {
        console.error('Error creating user:', error.response ? error.response.data : error.message);
      }
    }
  };

  const handleReset = () => {
    setFormData({
      firstName: '',
      lastName: '',
      cine: '',
      email: '',
      password: '',
      role: '',
      status: 'active'
    });
    setFormErrors({});
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="text"
            label="First Name"
            name="firstName"
            onBlur={handleBlur}
            value={formData.firstName}
            onChange={handleChange}
            error={!!formErrors.firstName}
            helperText={formErrors.firstName}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="text"
            label="Last Name"
            name="lastName"
            onBlur={handleBlur}
            value={formData.lastName}
            onChange={handleChange}
            error={!!formErrors.lastName}
            helperText={formErrors.lastName}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            type="text"
            label="CINE"
            name="cine"
            onBlur={handleBlur}
            value={formData.cine}
            onChange={handleChange}
            error={!!formErrors.cine}
            helperText={formErrors.cine}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            type="email"
            label="Email"
            name="email"
            onBlur={handleBlur}
            value={formData.email}
            onChange={handleChange}
            error={!!formErrors.email}
            helperText={formErrors.email}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            type="password"
            label="Password"
            name="password"
            onBlur={handleBlur}
            value={formData.password}
            onChange={handleChange}
            error={!!formErrors.password}
            helperText={formErrors.password}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth error={!!formErrors.role}>
            <InputLabel>Role</InputLabel>
            <Select
              label="Role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              onBlur={handleBlur}
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="secretaire">Secrétaire</MenuItem>
            </Select>
            {formErrors.role && <Typography variant="caption" color="error">{formErrors.role}</Typography>}
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            disabled
            label="Status"
            value="Active"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button type="button" variant="outlined" color="secondary" onClick={handleReset}>
              Clear
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Next
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </form>
  );
}

NewUserForm.propTypes = {
  onClose: PropTypes.func.isRequired,
};
export default function UserPage() {
  const [isNewUserFormOpen, setIsNewUserFormOpen] = useState(false);
  const [usersData, setUsersData] = useState([]);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/auth/getUsers");
        setUsersData(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (cine) => {
    try {
      // Envoi de la requête de suppression à l'API
      await axios.delete(`http://localhost:3000/auth/utilisateurs/${cine}`);

      // Mettre à jour l'état local pour supprimer l'utilisateur du tableau
      setUsersData(usersData.filter(user => user.cine !== cine));
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur :', error);
    }
  };
  const handleEdit = async (currentStatus, cine) => {
    try {
      // Basculer automatiquement le statut
      const newStatus = currentStatus === 'active' ? 'banned' : 'active';

      // Envoi de la requête de mise à jour à l'API
      await axios.put(`http://localhost:3000/auth/utilisateurs/${cine}`, { statut: newStatus });

      // Mettre à jour l'état local pour refléter le nouveau statut
      const updatedUsers = usersData.map(user => {
        if (user.cine === cine) {
          return { ...user, statut: newStatus };
        }
        return user;
      });
      setUsersData(updatedUsers);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut de l\'utilisateur :', error);
    }
  };




  const handleOpenNewUserForm = () => {
    setIsNewUserFormOpen(true);
  };

  const handleCloseNewUserForm = () => {
    setIsNewUserFormOpen(false);
  };

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = usersData.map((user) => user.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const dataFiltered = applyFilter({
    inputData: usersData,
    comparator: getComparator(order, orderBy),
    filterName,
  });


  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
  <Typography variant="h4">Users</Typography>
  <Button onClick={handleOpenNewUserForm} startIcon={<PersonAddIcon />} variant="text">
    New User
  </Button>
</Stack>

      {isNewUserFormOpen && (
        <Card>
          <Typography variant="h6">Add New User</Typography>
          <NewUserForm onClose={handleCloseNewUserForm} />
        </Card>
      )}

      {!isNewUserFormOpen && (
        <Card>
          <UserTableToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />
          <Scrollbar>
            <TableContainer sx={{ overflow: 'unset' }}>
              <Table sx={{ minWidth: 800 }}>
                <UserTableHead
                  order={order}
                  orderBy={orderBy}
                  rowCount={usersData.length}
                  numSelected={selected.length}
                  onRequestSort={handleSort}
                  onSelectAllClick={handleSelectAllClick}
                  headLabel={[
                    { id: 'name', label: 'Name' },
                    { id: 'company', label: 'CINE' },
                    { id: 'email', label: 'Email' },
                    { id: 'role', label: 'Role' },
                    { id: 'status', label: 'Status' },

                    { id: '' },
                  ]}
                />
                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((user) => (
                      <UserTableRow
                        key={user.id}
                        name={user.nom}
                        role={user.role}
                        status={user.statut}
                        company={user.email}
                        avatarUrl={user.cine} // Change ici
                        handleClick={(event) => handleClick(event, user.name)}
                        handleDelete={() => handleDelete(user.cine)}
                        handleEdit={() => handleEdit(user.statut, user.cine)}  // 
                      />
                    ))}
                  <TableEmptyRows
                    height={77}
                    emptyRows={emptyRows(page, rowsPerPage, usersData.length)}
                  />
                  {notFound && <TableNoData query={filterName} />}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
          <TablePagination
            page={page}
            component="div"
            count={usersData.length}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            rowsPerPageOptions={[5, 10, 25]}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      )}
    </Container>
  );
}
