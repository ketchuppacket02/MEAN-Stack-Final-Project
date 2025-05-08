const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const http = require('http');

const app = express();
app.use(cors(
));

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

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

mongoose.connect(process.env.MONGODB_URI, {
     useNewUrlParser: true,   
     useUnifiedTopology: true
    })
    .then(() => {
      console.log('Connected to MongoDB');
      const server = http.createServer(app);
      server.listen(port);
      server.on('error', onError);
      server.on('listening', onListening);
    })
    .catch(err => console.error('MongoDB connection error:', err));

function normalizePort(val) {
  const port = parseInt(val, 10);
  if (isNaN(port)) return val;
  if (port >= 0) return port;
  return false;
}

function onError(error) {
  if (error.syscall !== 'listen') throw error;
  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  const addr = this.address();
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  console.log('Listening on ' + bind);
}

app.get('/test', (req, res) => {
  res.send('Test route works!');
});
