require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors({
  origin: 'http://localhost:4200'
}));

app.use(express.json());

// Import routes
const userRoutes  = require('./routes/users');
const movieRoutes = require('./routes/movies');
const omdbRoutes  = require('./routes/omdb');

app.use('/api/users', userRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/omdb',  omdbRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI, {
     useNewUrlParser: true,   
     useUnifiedTopology: true
    })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));
