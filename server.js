require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT
const fruits = require('./models/fruits');
const ejs = require('ejs');
const methodOverride = require('method-override')

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended:false}));
app.use(express.static('public'));
app.use(methodOverride('_method'));

//INDEX
app.get('/fruits', (req, res) => {
  res.render('index', { fruits })
})

//NEW
app.get('/fruits/new', (req, res) => {
  res.render('new')
})

//POST
app.post('/fruits', (req, res) => {
  console.log(req.body)
  if (req.body.readyToEat === 'on') { // if checked, req.body.readyToEat is set to 'on'
    req.body.readyToEat = true
  } else { // if not checked, req.body.readyToEat is undefined
    req.body.readyToEat = false
  }
  fruits.push(req.body)
  res.redirect('/fruits')
})

//SHOW
app.get('/fruits/:indexOfFruitsArray', (req, res) => {
  res.render('show', {
    fruit: fruits[req.params.indexOfFruitsArray]
  })
})

//EDIT
app.get('/fruits/:indexOfFruitsArray/edit', (req, res) => {
  res.render('edit', { fruit: fruits[req.params.indexOfFruitsArray],
    fruitIndex: req.params.indexOfFruitsArray })
})

//DELETE
app.delete('/fruits/:indexOfFruitsArray', (req, res) => {
  fruits.splice(req.params.indexOfFruitsArray, 1);
  res.redirect('/fruits');
})

//PUT
app.put('/fruits/:indexOfFruitsArray', (req, res) => {
  fruits[req.params.indexOfFruitsArray] = req.body;
  res.redirect('/fruits');
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
})