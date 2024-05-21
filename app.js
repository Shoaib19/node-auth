const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const authRoutes = require('./routes/authRoutes');

const app = express();

// middleware
app.use(express.static('public'));
app.use(morgan.apply('dev'))
app.use(express.json());
// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = "mongodb+srv://shoaib:e7VaytfdJVgttYzl@nodelearning.bm1q2vb.mongodb.net/auth-db"
mongoose.connect(dbURI)
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

// routes
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', (req, res) => res.render('smoothies'));
app.use(authRoutes);