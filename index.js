require('dotenv').config()

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const Phonebook = require('./models/phonebook');

app.use(express.static('build'))
app.use(cors());
app.use(express.json());
app.use(morgan((tokens, req, res) => {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    JSON.stringify(req.body),
  ].join(' ');
}));

app.get('/info', (req, res, next) => {
  res.contentType('text/plain');
  
  Phonebook.countDocuments().then((count) => {
    res.write(`Phonebook has info for ${count} people\n`);
    res.write(new Date().toISOString());
    res.end();
  }).catch(error => next(error));
});

app.get('/api/persons', (req, res, next) => {
  Phonebook.find({}).then(persons => {
    res.json(persons);
  }).catch(error => next(error));
});

app.get('/api/persons/:id', (req, res, next) => {
  const person = Phonebook.findById(req.params.id).then((person) => {
    if (person) {
      res.json(person.toJSON());
    } else {
      res.sendStatus(404);
    }
  }).catch(error => next(error));
});

app.post('/api/persons', (req, res, next) => {
  const newPerson = req.body;

  if (!newPerson.name) {
    res.status(400).jsonjson(
      { error: 'must have name' }
    ).end();
    return;
  }

  if (!newPerson.number) {
    res.status(400).json(
      { error: 'must have number' }
    ).end();
    return;
  }

  const person = new Phonebook({
    ...newPerson,
  });

  person.save().then((savedPerson) => {
    res.status(200).json(savedPerson).end();
  }).catch(error => next(error));
});

app.put('/api/persons/:id', (req, res, next) => {
  const person = req.body;

  if (!person.name) {
    res.status(400).jsonjson(
      { error: 'must have name' }
    ).end();
    return;
  }

  if (!person.number) {
    res.status(400).json(
      { error: 'must have number' }
    ).end();
    return;
  }

  Phonebook.findByIdAndUpdate(req.params.id, person, { new: true }).then((updatedPerson) => {
    res.status(200).json(updatedPerson).end();
  }).catch(error => next(error));
});

app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id;

  Phonebook.findByIdAndRemove(id).then((result) => {
    res.sendStatus(204);
  }).catch(error => next(error));
});

const errorHandler = (err, req, res, next) => {
  console.error(err.message);
  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'malformed id'});
  }
  next(err);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`server started at port ${PORT}`);
});
