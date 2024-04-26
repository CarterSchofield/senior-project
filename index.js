const cors = require('cors')
const express = require('express');
const model = require('./model');

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static("public"));

