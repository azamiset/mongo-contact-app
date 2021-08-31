const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/contact', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

// menambah 1 data
/*
 const contact1 = new Contact({
  nama: 'Haris Martin',
  nohp: '0812766771',
  email: 'martin@gmail.com',
});

// simpan ke collection
contact1.save().then(contact => console.log(contact));
*/