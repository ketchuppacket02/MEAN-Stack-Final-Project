const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  movieLists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MovieList' }]
});

module.exports = mongoose.model('User', userSchema);