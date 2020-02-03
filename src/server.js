require('dotenv').config();

const express = require('express');

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(require('cors')());
app.use(require('./routes'));

module.exports = app;
