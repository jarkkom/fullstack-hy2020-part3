const express = require('express');

const app = express();

app.use(express.json());

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
  res.json(persons);
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
    res.write(JSON.stringify(
          { error: 'must have name' })
      );
    res.end();
    return;
  }

  if (!newPerson.number) {
    res.status(400);
    res.write(JSON.stringify(
          { error: 'must have number' })
      );
    res.end();
    return;
  }

  if (persons.find(person => person.name == newPerson.name)) {
    res.status(409);
    res.write(JSON.stringify(
          { error: 'name must be unique' })
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
  res.write(JSON.stringify(person));
  res.end();
});


app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);

  persons = persons.filter(person => person.id !== id);

  res.sendStatus(204);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`server started at port ${PORT}`);
});
