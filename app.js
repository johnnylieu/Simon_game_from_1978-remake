const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
_ = require('lodash');
const {test123} = require('./noneyo.js');

port = process.env.PORT || 3000;

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect(`mongodb+srv://jlieu83:${test123}@cluster0.lkecag0.mongodb.net/simongameDB`)

const scoreSchema = new mongoose.Schema({
    name: String,
    store: Number
});

const Score = mongoose.model('Score', scoreSchema);

app.get('/', function(req, res){
    res.render('index');
});

app.post('/score', function(req, res){
    console.log(req.body.userScore);
});

app.listen(port, function() {
    console.log(`Server started on port ${port}`);
  });