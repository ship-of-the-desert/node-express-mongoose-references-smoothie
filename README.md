# Full Mongoose CRUD for Fruits and Add Smoothie

<br>

## Add Mongoose to the Edit route

In `server.js`

```js
app.get('/fruits/:indexOfFruitsArray/edit', (req, res) => {
  Fruit.findById(req.params.indexOfFruitsArray)
    .then(fruit => {
      res.render('edit', { fruit })
    })
})
```

In `views/edit.ejs`

```js
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <link rel="stylesheet" href="/app.css">
    <title></title>
  </head>
  <body>
    <h1>Edit Fruit Page</h1>
    <form action="/fruits/<%= fruit._id %>?_method=put" method="POST">
      <label for="name">Name</label>
      <input type="text" name="name" id="name" value="<%= fruit.name %>"/>
      <label for="color">Color</label>
      <input type="text" name="color" id="color" value="<%= fruit.color %>"/>
      <label for="isReadyToEat">Is Ready to Eat</label>
      <input type="checkbox" name="readyToEat" id="isReadyToEat" 
      checked="<%= fruit.readyToEat ? 'checked' : null %>"/>
      <input type="submit" value="Edit Fruit">
    </form>
  </body>
</html>
```

<br>

## Add Mongoose to the PUT route

In `server.js`

```js
app.put('/fruits/:indexOfFruitsArray', (req, res) => {
  let fruit = req.body
  fruit.readyToEat = fruit.readyToEat === 'on' ? true : false

  Fruit.findByIdAndUpdate(
      req.params.indexOfFruitsArray, // id of fruit to updte
      fruit, // the fruit data
      { new: true } // return the updated document
    ).then(updatedFruit => {
      console.log(updatedFruit)
      res.redirect(`/fruits/${updatedFruit._id}`);
    })
})
```
<br>

## Add Mongoose to the DELETE route

In 	`views/index.ejs`

```html
      <form action="/fruits/<%= fruits[i]._id %>?_method=DELETE" method="POST">
        <input type="submit" value="DELETE"/>
      </form>
```

In `server.js`

```js
//FRUIT DELETE
app.delete('/fruits/:indexOfFruitsArray', (req, res) => {
  Fruit.findByIdAndDelete(req.params.indexOfFruitsArray)
    .then(() => {
      res.redirect('/fruits');
    })
})
```

<br>

## Smoothie model

- `touch models/smoothie.js`

```js
const mongoose = require('mongoose');

const smoothieSchema = new mongoose.Schema({
    name:  { type: String, required: true },
    fruits: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Fruit' }]
  }, {
    timestamps: true 
});

const Smoothie = mongoose.model('Smoothie', smoothieSchema);

module.exports = Smoothie;
```

- We added tiimestamps
- We have an Array of `fruits` that references the `fruits` collection

<br>

<details>
	<summary>Smoothie/Fruit Embedded Documents</summary>
	
We already have a collectoin of Fruits for this app. However, if we started over and wanted to embed a Fruit document inside a Smoothie this is how:
	
```js
const mongoose = require('mongoose');
const Fruit = require('./fruit').schema;

const smoothieSchema = new mongoose.Schema({
    name:  { type: String, required: true },
    fruits:  [Fruit]
});

const Smoothie = mongoose.model('Smoothie', smoothieSchema);

module.exports = Smoothie;
```
	
</details>

<br>

## Fruit Model

```js
const mongoose = require('mongoose');

const fruitSchema = new mongoose.Schema({
    name:  { type: String, required: true },
    color:  { type: String, required: true },
    readyToEat: Boolean
  }, {
  timestamps: true 
});

const Fruit = mongoose.model('Fruit', fruitSchema);

module.exports = Fruit;
```
<br>


## Test Data

- `touch models/test-db.js`

```js
const mongoose = require('mongoose');
const Fruit = require('./fruit');
const Smoothie = require('./smoothie');

mongoose.connect('mongodb://localhost:27017/basiccrud', { useNewUrlParser: true});
mongoose.connection.once('open', ()=> {
    console.log('connected to mongo');
});

async function createData() {
// create new fruits

const banana = await Fruit.create({ name: 'Banana', color: 'blue', readyToEat: true })
const watermelon = await Fruit.create({ name: 'Watermelon', color: 'black', readyToEat: true })

// create new smoothie
const bananaSmoothie = await new Smoothie({ name: "Banana Smoothie" })

// push fruits into array
await bananaSmoothie.fruits.push(banana, watermelon)

await bananaSmoothie.save()
console.log(bananaSmoothie)
}

createData()
```

- In the Terminal, run `node models/test-db.js`

<br>


## Smoothie Index

`server.js`

```js
//SMOOTHIE INDEX
app.get('/smoothies', (req, res) => {
  Smoothie.find()
    .then(smoothies => {
      res.send(smoothies)
    })
})
```

<br>

## Smoothie New

- Make a `smoothies` folder in `views`
- `touch views/smoothies/new`
- `smoothies/new.ejs`

	```html
	<!DOCTYPE html>
	<html>
	  <head>
	    <meta charset="utf-8">
	    <link rel="stylesheet" href="/app.css">
	    <title></title>
	  </head>
	  <body>
	    <h1>New Smoothie Page</h1>
	    <form action="/smoothies" method="POST">
	      <label for="name">Name</label>
	      <input type="text" name="name" id="name"/>
	      <br>
	      <% fruits.forEach(fruit => { %>
	        <input type="checkbox" name="smoothieFruitsArray" value="<%= fruit._id %>"><%= fruit.name %><br>
	      <% }) %>
	
	      <input type="submit" value="Create Smoothie">
	    </form>
	  </body>
	</html>	
	```
	
- `server.js`

	```js
	app.get('/smoothies/new', (req, res) => {
	  Fruit.find()
	    .then(fruits => {
	      res.render('smoothies/new', { fruits })
	    })
	})
	```

<br>
	
## Smoothie POST

```js
app.post('/smoothies', (req, res) => {
  let newSmoothie = new Smoothie(req.body)

  req.body.smoothieFruitsArray.forEach(fruit => {
    newSmoothie.fruits.push(fruit)
  })
  
  newSmoothie.save()
  
  res.redirect('/smoothies');
})
```

<br>
	
## Smoothie Index and Populate Fruit

```js
app.get('/smoothies', (req, res) => {
  Smoothie.find()
    .sort('-createdAt')
    .populate('fruits')
    .then(smoothies => {
      console.log(smoothies)
      res.send(smoothies)
    })
})
```

<br>

## You Do

- Add Smoothie
	- index vieiw
	- show view
	- edit/update route
	- delete route 
	- add `New Fruit` fields to the smoothie new form so you can create a new fruit and add it to the smoothie

<br>

## Additional Resources

- [Mongoose Populate](https://mongoosejs.com/docs/populate.html)
- [Mongoose Schema](https://mongoosejs.com/docs/guide.html)
