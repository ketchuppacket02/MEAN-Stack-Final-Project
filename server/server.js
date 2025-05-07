const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const apiKey = '2e634a94';

const app = express();
app.use(cors());
app.use(express.json());

// Import routes
const userRoutes = require('./routes/users');
const movieRoutes = require('./routes/movies');
const omdbRoutes = require('./routes/omdb');

app.use('/api/users', userRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/omdb', omdbRoutes);

// Connect to MongoDB Atlas using .env
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(3000, () => console.log('Server running on port 3000')))
  .catch(err => console.error(err));
