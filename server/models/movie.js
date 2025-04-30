const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: String,
  ratings: [{ user: String, score: Number }]
});

module.exports = mongoose.model('Movie', movieSchema);
