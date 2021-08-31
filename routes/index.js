var express = require('express');
const Contact = require('../model/contact');
const { body, validationResult, check } = require('express-validator');

var router = express.Router();


/* GET home page
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
*/

// Home Page
router.get('/', (req, res) => {
  const mahasiswa = [
    { nama: 'Andi', email: 'andi@gmail.com' },
    { nama: 'Haris', email: 'haris@gmail.com' },
    { nama: 'Testi', email: 'testi@gmail.com' },
    { nama: 'Wanda', email: 'wanda@gmail.com' },
  ];
  res.render('pages/index', {
    layout: 'layouts/main',
    title: 'Home',
    nama: 'Wandy Azami',
    mahasiswa
  });
})

// About Page
router.get('/about', (req, res) => {
  res.render('pages/about', {
    layout: 'layouts/main',
    title: 'About',
  });
})

// Contact Page / Tampilkan semua data contact
router.get('/contact', async (req, res) => {
  const contacts = await Contact.find();

  res.render('pages/contacts', {
    layout: 'layouts/main',
    title: 'Contact',
    contacts,
    msg: req.flash('msg'),
  });
})

// halaman form tambah data contact
router.get('/add-contact', (req, res) => {
  res.render('contact/add', {
    layout: 'layouts/main',
    title: 'Add New Contact'
  })
})

// proses tambah data contact
router.post('/contact',
  [
    body('nama').custom(async (value) => {
      const duplikat = await Contact.findOne({ nama: value });
      if (duplikat) {
        throw new Error('Nama contact sudah digunakan!');
      }
      return true;
    }),
    check('email', 'Email tidak valid!').isEmail(),
    check('nohp', 'No HP tidak valid!').isMobilePhone()
  ], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // return res.status(400).json({ errors: errors.array() });
      res.render('contact/add', {
        layout: 'layouts/main',
        title: 'Add New Contact',
        errors: errors.array(),
      });
    } else {
      Contact.insertMany(req.body, (error, result) => {
        // flash message
        req.flash('msg', 'Data contact berhasil ditambahkan!');
        res.redirect('/contact');
      });
    }
  }
);

// halaman detail contact
router.get('/contact/:nama', async (req, res) => {
  // let contact = findContact(req.params.nama);
  let contact = await Contact.findOne({ nama: req.params.nama });

  res.render('contact/detail', {
    layout: 'layouts/main',
    title: 'Detail Contact',
    contact,
  });
})

// halaman form ubah data contact
router.get('/edit-contact/:nama', async (req, res) => {
  const contact = await Contact.findOne({ nama: req.params.nama });

  res.render('contact/edit', {
    layout: 'layouts/main',
    title: 'Edit This Contact',
    contact,
  })
})

// proses ubah data
router.put('/contact',
  [
    body('nama').custom(async (value, { req }) => {
      const duplikat = await Contact.findOne({ nama: value });
      if (value !== req.body.oldNama && duplikat) {
        throw new Error('Nama contact sudah digunakan!');
      }
      return true;
    }),
    check('email', 'Email tidak valid!').isEmail(),
    check('nohp', 'No HP tidak valid!').isMobilePhone()
  ], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('contact/edit', {
        layout: 'layouts/main',
        title: 'Edit This Contact',
        errors: errors.array(),
        contact: req.body,
      });
    } else {
      Contact.updateOne(
        { _id: req.body._id },
        {
          $set: {
            nama: req.body.nama,
            email: req.body.email,
            nohp: req.body.nohp,
          },
        }
      ).then(result => {
        // kirimkan flash message
        req.flash('msg', 'Data contact berhasil diubah!');
        res.redirect('/contact');
      })
    }
  }
);

// proses hapus data contact
router.delete('/contact', (req, res) => {
  Contact.deleteOne({ nama: req.body.nama }).then(result => {
    req.flash('msg', 'Data contact berhasil dihapus!');
    res.redirect('/contact');
  });
})


module.exports = router;