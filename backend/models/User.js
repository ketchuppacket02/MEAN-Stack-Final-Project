const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  movieLists: [{
    name: {
      type: String,
      required: true
    },
    movies: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie'
    }]
  }]
}, {
  timestamps: true
});

// Add a compound index to ensure unique movie list names per user
userSchema.index({ username: 1, 'movieLists.name': 1 }, { unique: true });

module.exports = mongoose.model('User', userSchema); 