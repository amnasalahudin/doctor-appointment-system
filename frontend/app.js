'use strict';

const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const axios = require('axios');

// Constants
const PORT = 3000;
const HOST = '0.0.0.0';

// App
const app = express();
app.use(express.static('public'));
app.use(bodyParser.json()); // for parsing application/json

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/hello', (req, res) => {
  res.send('Hello world\n');
});

// Proxy GET requests to Flask server
app.get('/api/doctors', async (req, res) => {
  let url = process.env.DOCTORS_SERVICE_URL;
  try {
    const response = await axios.get(`http://${url}/doctors`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ error: 'Could not fetch doctors' });
  }
});

// POST requests to Flask server
app.post('/api/doctors', async (req, res) => {
  let url = process.env.DOCTORS_SERVICE_URL;
  try {
    const response = await axios.post(`http://${url}/doctors`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error('Error adding doctor:', error);
    res.status(500).json({ error: 'Could not add doctor' });
  }
});

app.get('/api/appointments', async (req, res) => {
  let url = process.env.APPOINTMENTS_SERVICE_URL;
  try {
    const response = await axios.get(`http://${url}/appointments`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Could not fetch appointments' });
  }
});

// Proxy POST requests to Flask server for appointments
app.post('/api/appointments', async (req, res) => {
  let url = process.env.APPOINTMENTS_SERVICE_URL;
  try {
      const response = await axios.post(`http://${url}/appointments`, req.body);
      res.json(response.data);
  } catch (error) {
      console.error('Error adding appointment:', error);
      res.status(500).json({ error: 'Could not add appointment' });
  }
});


// small edit on feature branch

//another edit on frontend

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});


app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
