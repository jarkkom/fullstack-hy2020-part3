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

let persons = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": 2
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": 3
  },
  {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": 4
  }
];

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
  const id = Number(req.params.id);

  const person = persons.find(person => person.id === id);
  if (!person) {
    return res.status(404).end();

  }

  res.json(person);
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

  person = {
    ...newPerson,
    id: Math.floor(Math.random() * 10000000)
  }

  persons = persons.concat(person);

  res.status(200);
  res.json(person);
  res.end();
});


app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);

  persons = persons.filter(person => person.id !== id);

  res.sendStatus(204);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`server started at port ${PORT}`);
});
