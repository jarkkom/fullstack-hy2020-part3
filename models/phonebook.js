const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true})
    .then(res => {
        console.log('connected to Mongo');
    })
    .catch((err) => {
        console.log('connecting to Mongo failed', err.message);
    });

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Phonebook = mongoose.model('Phonebook', phonebookSchema);

phonebookSchema.set('toJSON', {
    transform: (document, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
    }
});

module.exports = mongoose.model('Phonebook', phonebookSchema);
