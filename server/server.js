//heroku link: adoglist.herokuapp.com

//https://www.guidedogs.org/wp-content/uploads/2015/05/Dog-Im-Not.jpg

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Dog = require("./models/dog.js").Dog;
const _ = require("lodash");
const path = require('path');
const hbs = require('hbs');
const methodOverride = require('method-override');
const multer = require('multer');

const upload = multer({dest: './public/images'});

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
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
  res.redirect('/dogs');
})

app.get('/dogs', (req, res) => {
  Dog.find()
    .then(dogs => {
      res.render('dogs/home', {dogs});
    }).catch(e => {
      res.status(404).send();
    })
})

app.get('/dogs/new', (req, res) => {
  res.render('dogs/new');
})

app.post('/dogs', upload.single('dogImage'), (req, res) => {
  const filepath = "/images/" + req.file.filename;

  const dog = new Dog({
    name:req.body.name,
    age: req.body.age,
    description: req.body.description,
    personality: req.body.personality,
    image: filepath
  })
  dog.save()
    .then(dog => {
      res.redirect('/');
    }).catch(e => {
      res.status(400).send();
    })
})

app.get('/:id', (req, res) => {
  const route = `/dogs/${req.params.id}`;
  res.redirect(route)
})

app.get('/dogs/:id', (req, res) => {
  Dog.find({"_id": req.params.id})
    .then(dogs => {
      res.render('dogs/show', {dog: dogs[0]})
    }).catch(e => {
      res.status(404).send();
    })
})

app.delete('/dogs/:id', (req, res) => {
  console.log("hit delete route");
  Dog.deleteOne({"_id": req.params.id})
    .then(dog => {
      res.redirect('../dogs');
    }).catch(e => {
      res.status(404).send();
    })
})

app.get('/dogs/update/:id', (req, res) => {
  Dog.find({"_id": req.params.id})
    .then(dogs => {
      const personality = dogs[0].personality;
      var happy = "";
      var quiet = "";
      var energetic = "";
      var lazy = "";
      if(personality === "happy") {
        happy = "selected";
      } else if(personality === "quiet") {
        quiet = "selected";
      } else if(personality === "energetic") {
        energetic = "selected";
      } else {
        lazy = "selected";
      }

      res.render('dogs/update',
      {
        dog: dogs[0],
        happy,
        quiet,
        energetic,
        lazy
      })
    }).catch(e => {
      res.status(404).send();
    })
})

app.post('/dogs/update/:id', upload.single('dogImage'), (req, res) => {
  var filepath;

  if(!req.file) {
    filepath = req.body.originalimg;
  } else {
    filepath = "/images/" + req.file.filename;
  }

  Dog.updateOne(
    {
      "_id": req.params.id
    },
    {
      $set: {
              name: req.body.name,
              age: req.body.age,
              description: req.body.description,
              personality: req.body.personality,
              image: filepath
            }
    },
    {
      returnOriginal:false
    }
  ).then(dog => {
    res.redirect('/');
  }).catch(e => {
    res.status(400).send();
  })
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
});
