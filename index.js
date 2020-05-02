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

app.get('/info', (req, res) => {
  res.contentType('text/plain');
  
  res.write(`Phonebook has info for ${persons.length} people\n`);
  res.write(new Date().toISOString());
  res.end();
});


app.get('/api/persons', (req, res) => {
  Phonebook.find({}).then(persons => {
    res.json(persons);
  })
});

app.get('/api/persons/:id', (req, res) => {
  const person = Phonebook.findById(req.params.id).then((person) => {
    res.json(person.toJSON());
  });
});

app.post('/api/persons', (req, res) => {
  const newPerson = req.body;

  if (!newPerson.name) {
    res.status(400);
    res.json(
      { error: 'must have name' }
    );
    res.end();
    return;
  }

  if (!newPerson.number) {
    res.status(400);
    res.json(
      { error: 'must have number' }
    );
    res.end();
    return;
  }

  if (persons.find(person => person.name == newPerson.name)) {
    res.status(409);
    res.json(
      { error: 'name must be unique' }
    );
    res.end();
    return;
  }

  const person = new Phonebook({
    ...newPerson,
  });

  person.save().then((savedPerson) => {
    res.status(200);
    res.json(savedPerson);
    res.end();
  });
});


app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id;

  Phonebook.findByIdAndRemove(id).then((result) => {
    res.sendStatus(204);
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`server started at port ${PORT}`);
});
