const express = require('express');
const ejs = require('ejs');
const path = require('path');
const uRoutes = require('./routes/uRoutes');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = 3000;

mongoose.connect(process.env.MONGO_URI);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', uRoutes);
app.use((req, res, next) => res.status(404).render('404', { title: '404' }));
app.use((err, req, res, next) => res.status(500).render('500', { title: '500' }));

app.listen(port, () => console.log(`App listening on port ${port}!`));
