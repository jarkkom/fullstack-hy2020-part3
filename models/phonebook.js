const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const mongooseOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
};

mongoose.connect(process.env.MONGODB_URL, mongooseOpts)
    .then(res => {
        console.log('connected to Mongo');
    })
    .catch((err) => {
        console.log('connecting to Mongo failed', err.message);
    });

const phonebookSchema = new mongoose.Schema({
  name: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
  },
  number: {
      type: String,
      required: true,
      minlength: 8,
  },
});

phonebookSchema.plugin(uniqueValidator);

const Phonebook = mongoose.model('Phonebook', phonebookSchema);

phonebookSchema.set('toJSON', {
    transform: (document, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
    }
});

module.exports = mongoose.model('Phonebook', phonebookSchema);
