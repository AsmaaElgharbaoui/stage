import axios from 'axios';
import { faker } from '@faker-js/faker';
import React, { useState, useEffect } from 'react';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import AppOrderTimeline from '../app-order-timeline';
import AppCurrentVisits from '../app-current-visits';
import AppWebsiteVisits from '../app-website-visits';
import AppWidgetSummary from '../app-widget-summary';
import AppConversionRates from '../app-conversion-rates';

// ----------------------------------------------------------------------

export default function AppView() {
  const [totalAppointments, setTotalAppointments] = useState(null);
  const [totalNewUsers, setTotalNewUsers] = useState(null);
  const [totalRooms, setTotalRooms] = useState(null);
  const [totalPatients, setTotalPatients] = useState(null); // Ajoutez le state pour stocker le total des patients

  useEffect(() => {
    const fetchTotalAppointments = async () => {
      try {
        const response = await axios.get('http://localhost:3000/auth/rdv/total');
        setTotalAppointments(response.data.total_rdv);
      } catch (error) {
        console.error('Erreur lors de la récupération du total des rendez-vous:', error);
      }
    };

    const fetchTotalNewUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/auth/utilisateurs/total');
        setTotalNewUsers(response.data.total_utilisateurs);
      } catch (error) {
        console.error('Erreur lors de la récupération du total des nouveaux utilisateurs:', error);
      }
    };

    const fetchTotalRooms = async () => {
      try {
        const response = await axios.get('http://localhost:3000/auth/salles/total');
        setTotalRooms(response.data.total_salles);
      } catch (error) {
        console.error('Erreur lors de la récupération du total des salles:', error);
      }
    };

    const fetchTotalPatients = async () => {
      try {
        const response = await axios.get('http://localhost:3000/auth/patients/count'); // Faites une requête GET à votre API pour récupérer le total des patients
        setTotalPatients(response.data.count); // Mettez à jour le state avec le total des patients récupéré
      } catch (error) {
        console.error('Erreur lors de la récupération du total des patients:', error);
      }
    };

    fetchTotalAppointments();
    fetchTotalNewUsers();
    fetchTotalRooms();
    fetchTotalPatients(); // Appelez la fonction pour récupérer le total des patients au chargement du composant
  }, []);

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Hi, Welcome back 👋
      </Typography>
      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Appointments"
            total={totalAppointments !== null ? totalAppointments : 'Loading...'} // Affichez le total des rendez-vous s'il est disponible, sinon affichez "Loading..."
            color="success"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_message.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="New Users"
            total={totalNewUsers !== null ? totalNewUsers : 'Loading...'} // Affichez le total des nouveaux utilisateurs s'il est disponible, sinon affichez "Loading..."
            color="info"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Rooms"
            total={totalRooms !== null ? totalRooms : 'Loading...'} // Affichez le total des salles s'il est disponible, sinon affichez "Loading..."
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_buy.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Patients" // Affichez le titre comme "Patients"
            total={totalPatients !== null ? totalPatients : 'Loading...'} // Affichez le total des patients s'il est disponible, sinon affichez "Loading..."
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AppWebsiteVisits
            title="Website Visits"
            subheader="(+43%) than last year"
            chart={{
              labels: [
                '01/01/2003',
                '02/01/2003',
                '03/01/2003',
                '04/01/2003',
                '05/01/2003',
                '06/01/2003',
                '07/01/2003',
                '08/01/2003',
                '09/01/2003',
                '10/01/2003',
                '11/01/2003',
              ],
              series: [
                {
                  name: 'Team A',
                  type: 'column',
                  fill: 'solid',
                  data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                },
                {
                  name: 'Team B',
                  type: 'area',
                  fill: 'gradient',
                  data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                },
                {
                  name: 'Team C',
                  type: 'line',
                  fill: 'solid',
                  data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppCurrentVisits
            title="Current Visits"
            chart={{
              series: [
                { label: 'America', value: 4344 },
                { label: 'Asia', value: 5435 },
                { label: 'Europe', value: 1443 },
                { label: 'Africa', value: 4443 },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AppConversionRates
            title="Conversion Rates"
            subheader="(+43%) than last year"
            chart={{
              series: [
                { label: 'Italy', value: 400 },
                { label: 'Japan', value: 430 },
                { label: 'China', value: 448 },
                { label: 'Canada', value: 470 },
                { label: 'France', value: 540 },
                { label: 'Germany', value: 580 },
                { label: 'South Korea', value: 690 },
                { label: 'Netherlands', value: 1100 },
                { label: 'United States', value: 1200 },
                { label: 'United Kingdom', value: 1380 },
              ],
            }}
          />
        </Grid>

        

        <Grid xs={12} md={6} lg={4}>
          <AppOrderTimeline
            title="Order Timeline"
            list={[...Array(5)].map((_, index) => ({
              id: faker.string.uuid(),
              title: [
                '1983, orders, $4220',
                '12 Invoices have been paid',
                'Order #37745 from September',
                'New order placed #XF-2356',
                'New order placed #XF-2346',
              ][index],
              type: `order${index + 1}`,
              time: faker.date.past(),
            }))}
          />
        </Grid>
      </Grid>
    </Container>
  );
}