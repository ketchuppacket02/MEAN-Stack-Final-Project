const User = require('../models/user');
const Movie = require('../models/movie');
const MovieList = require('../models/movieList');
const bcrypt = require('bcrypt');

exports.createUser = async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) return res.status(400).json({ error: 'Username is required' });
    const user = new User({ username, movies: [] });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    console.error('Create user error:', err.message);
    res.status(500).json({ error: 'Failed to create user', details: err.message });
  }
};

exports.getUserMovies = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('movies');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user.movies);
  } catch (err) {
    console.error('Fetch user movies error:', err.message);
    res.status(500).json({ error: 'Failed to fetch user movies', details: err.message });
  }
};

exports.addMovieToUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: 'Movie title is required' });
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    let movie = await Movie.findOne({ title });
    if (!movie) {
      movie = new Movie({ title, ratings: [] });
      await movie.save();
    }
    if (!user.movies.includes(movie._id)) {
      user.movies.push(movie._id);
      await user.save();
    }
    res.status(201).json(movie);
  } catch (err) {
    console.error('Add movie to user error:', err.message);
    res.status(500).json({ error: 'Failed to add movie to user', details: err.message });
  }
};

exports.createMovieList = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'List name is required' });
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const existing = await MovieList.findOne({ owner: user._id, name });
    if (existing) return res.status(400).json({ error: 'List name already exists' });
    const newList = new MovieList({ name, owner: user._id, movies: [] });
    await newList.save();
    user.movieLists.push(newList._id);
    await user.save();
    res.status(201).json(newList);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create movie list', details: err.message });
  }
};

exports.getMovieLists = async (req, res) => {
  try {
    const lists = await MovieList.find({ owner: req.params.userId }).populate('movies');
    res.json(lists);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch movie lists', details: err.message });
  }
};

exports.addMovieToList = async (req, res) => {
  try {
    const { movieId } = req.body;
    const list = await MovieList.findOne({ _id: req.params.listId, owner: req.params.userId });
    if (!list) return res.status(404).json({ error: 'List not found' });
    if (!list.movies.includes(movieId)) {
      list.movies.push(movieId);
      await list.save();
    }
    res.status(201).json(list);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add movie to list', details: err.message });
  }
};

exports.removeMovieFromList = async (req, res) => {
  try {
    const list = await MovieList.findOne({ _id: req.params.listId, owner: req.params.userId });
    if (!list) return res.status(404).json({ error: 'List not found' });
    list.movies = list.movies.filter(mId => mId.toString() !== req.params.movieId);
    await list.save();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove movie from list', details: err.message });
  }
};

exports.deleteMovieList = async (req, res) => {
  try {
    const list = await MovieList.findOneAndDelete({ _id: req.params.listId, owner: req.params.userId });
    if (!list) return res.status(404).json({ error: 'List not found' });
    await User.findByIdAndUpdate(req.params.userId, { $pull: { movieLists: req.params.listId } });
    res.json({ message: 'Movie list deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete movie list', details: err.message });
  }
};

exports.registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ error: 'Username already exists' });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({ username, password: hashedPassword, movieLists: [] });
    await user.save();
    res.status(201).json({ _id: user._id, username: user.username });
  } catch (err) {
    res.status(500).json({ error: 'Failed to register user', details: err.message });
  }
};

exports.getMoviesForList = async (req, res) => {
  try {
    const list = await MovieList.findOne({ _id: req.params.listId, owner: req.params.userId }).populate('movies');
    if (!list) return res.status(404).json({ error: 'List not found' });
    res.json(list.movies);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch movies for list', details: err.message });
  }
};
