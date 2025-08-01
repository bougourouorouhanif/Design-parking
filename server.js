const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// Serve static files
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'demo-status.html'));
});

app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/map', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'map.html'));
});

app.get('/spot/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'spot.html'));
});

app.get('/auth', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'auth.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/owner', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'owner.html'));
});

app.get('/owner-profile', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'owner-profile.html'));
});

app.get('/owner-reservations', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'owner-reservations.html'));
});

app.get('/owner-earnings', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'owner-earnings.html'));
});

app.get('/add-spot', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'add-spot.html'));
});

app.get('/payment', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'payment.html'));
});

app.get('/navigation', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'navigation.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/navbar-demo', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'navbar-demo.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Parky app running at http://0.0.0.0:${port}/`);
});
