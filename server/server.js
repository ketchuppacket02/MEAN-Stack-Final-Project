const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors({
  origin: 'http://localhost:4200'
}));

app.use(express.json());

// Import routes
const userRoutes  = require('./routes/users');
const movieRoutes = require('./routes/movies');
const omdbRoutes  = require('./routes/omdb');
const authRoutes  = require('./routes/auth');

app.use('/api/users', userRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/omdb',  omdbRoutes);
app.use('/api/auth',  authRoutes);

const PORT = 3000;

mongoose.connect(process.env.MONGODB_URI, {
     useNewUrlParser: true,   
     useUnifiedTopology: true
    })
    .then(() => {
      console.log('Connected to MongoDB');
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch(err => console.error('MongoDB connection error:', err));
