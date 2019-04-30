require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT
const Fruit = require('./models/fruit');
const ejs = require('ejs');
const methodOverride = require('method-override')
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/fruits', {useNewUrlParser : true})
.then(()=> console.log('Mongodb is running'),(err)=> console.log(err) )

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended:false}));
app.use(express.static('public'));
app.use(methodOverride('_method'));

//INDEX
app.get('/fruits', (req, res) => {
  
  Fruit.find()
  .then((fruits)=>{
    res.render('index', { fruits })
  }).catch(err => console.log(err))

})

//NEW
app.get('/fruits/new', (req, res) => {
  res.render('new')
})

//POST
app.post('/fruits', (req, res) => {

  let data = {
    name: req.body.name, 
    color: req.body.color
  }

  if (req.body.readyToEat === 'on') { // if checked, req.body.readyToEat is set to 'on'
    data.readyToEat = true
  } else { // if not checked, req.body.readyToEat is undefined
    data.readyToEat = false
  }

  let fruit = new Fruit(data)
  fruit.save()
  .then(()=> {
    res.redirect('/fruits')
  }).catch(err => console.log(err))

  
})

//SHOW
app.get('/fruits/:indexOfFruitsArray', (req, res) => {
  Fruit.findById(req.params.indexOfFruitsArray)
  .then((fruit)=>{
    res.render('show', {
      fruit: fruit
    })
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