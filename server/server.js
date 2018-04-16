const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Dog = require("./models/dog.js").Dog;
const _ = require("lodash");
const path = require('path');
const hbs = require('hbs');
const methodOverride = require('method-override');

const app = express();

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '../app/views'));
hbs.registerPartials(path.join(__dirname, '../app/views/partials'))

const port = process.env.PORT || 3000;

mongoose.Promise = global.Promise;
const database = process.env.MONGODB_URI || "mongodb://localhost:27017/Doglist";
mongoose.connect(database)
  .then(() => {
    console.log('connected to databse');
  }).catch(() => {
    console.log('unable to connect to the database')
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
  res.redirect('/dogs');
})

app.get('/dogs', (req, res) => {
  Dog.find()
    .then(dogs => {
      res.send(dogs);
    }).catch(e => {
      res.status(404).send();
    })
})

app.get('/dogs/new', (req, res) => {
  res.render('dogs/new');
})

app.post('/dogs', (req, res) => {
  if(!req.body.name || !req.body.age) {
    res.status(404).send();
  }
  const dog = new Dog({
    name:req.body.name,
    age: req.body.age
  })
  dog.save()
    .then(dog => {
      res.send(dog);
    }).catch(e => {
      res.status(400).send();
    })
})

app.delete('/dogs/:id', (req, res) => {
  console.log("hit delete route");
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
});
