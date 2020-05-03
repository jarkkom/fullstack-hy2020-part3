const mongoose = require('mongoose');

function usage() {
  console.log('usage: mongo.js <password> [name] [phonenumber]');
  process.exit(1);
}

if (process.argv.length !== 3 && process.argv.length !== 5) {
  usage();
}

const password = process.argv[2];

const mongoUrl = `mongodb+srv://fullstackhy2020:${password}@freecluster-96odi.mongodb.net/note-app?retryWrites=true&w=majority`;

mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Phonebook = mongoose.model('Phonebook', phonebookSchema);

const argNum = process.argv.length;

if (argNum === 3) {
  Phonebook.find({}).then((res) => {
    console.log('phonebook:');
    res.forEach((pb) => {
      console.log(`${pb.name} ${pb.number}`);
    });
  }).catch((err) => {
    console.log(err);
  }).finally(() => {
    mongoose.connection.close();
  });
} else {
  const name = process.argv[3];
  const number = process.argv[4];
  const phonebook = new Phonebook({
    name,
    number,
  });
  phonebook.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`);
  }).catch((err) => {
    console.log(err);
  }).finally(() => {
    mongoose.connection.close();
  });
}
