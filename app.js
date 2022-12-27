const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const session = require('express-session')
const flash = require('connect-flash')
const mongoose = require('mongoose')
const { body, validationResult, check, Result } = require('express-validator')
const methodOverride = require('method-override')

const Contact = require('./model/contact')
const { findOne } = require('./model/contact')
const { render } = require('ejs')


const app = express()
const port = 3000

app.use(methodOverride('_method'))

mongoose
    .connect('mongodb://127.0.0.1:27017/belajar_nodejs', {})
    .then(() => console.log("DB connected"))
    .catch((err) => console.log("DB Error => ", err));

app.set('view engine', 'ejs')
app.use(expressLayouts);
app.use(express.urlencoded());

app.get('/', (req, res) => {

    const mahasiswa = [
        {
            nama: "Rizky",
            email: "rizky@gmail.com",
        },
        {
            nama: "Ferdian",
            email: "ferdian@gmail.com",
        },
        {
            nama: "Prasetyo",
            email: "prasetyo@gmail.com",
        },
    ]
    // res.sendFile('./index.html', { root: __dirname })
    res.render('index', { nama: "Rizky", mahasiswa, layout: 'layouts/main-layouts' })
})

app.get('/about', (req, res) => {
    res.render('about', {
        layout: 'layouts/main-layouts'
    })
})

app.get('/contact', async (req, res) => {

    const contacts = await Contact.find()
    console.log(contacts);

    res.render('contact', {
        layout: 'layouts/main-layouts',
        contacts
    })
})

app.get('/contact/add', (req, res) => {
    res.render('add-contact', {
        layout: 'layouts/main-layouts',
    })
})



app.post('/contact', [
    body('nama').custom(async (value) => {
        const duplikat = await Contact.findOne({ nama: value })
        if (duplikat) {
            throw new Error('Nama Sudah Tersedia')
        }
        return true
    }),
    check('email', 'Email tidak valid').isEmail(),
    check('nohp', 'No HP tidak valid').isMobilePhone()
], (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.render('add-contact', {
            layout: 'layouts/main-layouts',
            errors: errors.array()
        })
    } else {
        Contact.insertMany(req.body, (error, result) => {
            res.redirect('/contact')
        })
    }
});

app.delete('/contact', (req, res) => {
    Contact.deleteOne({ nama: req.body.nama }).then((result) => {
        res.redirect('/contact')
    })
})

// app.get('/contact/delete/:nama', async (req, res) => {
//     const contact = await Contact.findOne({ nama: req.params.nama })
//     if (!contact) {
//         res.send('<h1> 404 </h1>')
//     } else {
//         Contact.deleteOne({ _id: contact._id }).then((result) => {
//             res.redirect('/contact')
//         })
//     }
// })

app.get('/contact/edit/:nama', async (req, res) => {
    const contact = await Contact.findOne({ nama: req.params.nama })
    res.render('edit-contact', {
        layout: 'layouts/main-layouts',
        contact
    })
})

app.put('/contact', [
    body('nama').custom(async (value, { req }) => {
        const duplikat = await Contact.findOne({ nama: value })
        if (!value !== req.body.oldNama && duplikat) {
            throw new Error('Nama sudah digunakan !')
        }
        return true
    }),
    check('email', 'email tidak valid').isEmail(),
    check('nohp', 'No Hp tidak valid').isMobilePhone(),
], (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        res.render('edit-contact', {
            layout: 'layouts/main-layouts',
            error: error.array(),
            contact: req.body
        })
    } else {
        Contact.updateOne({ _id: req.body._id }, {
            $set: {
                nama: req.body.nama,
                email: req.body.email,
                nohp: req.body.nohp
            }
        }
        ).then((result) => {
            res.redirect('/contact')
        })
    }
}

)

app.get('/contact/:nama', async (req, res) => {
    const contact = await Contact.findOne({ nama: req.params.nama })
    res.render('detail', {
        layout: 'layouts/main-layouts',
        contact
    })
})

app.listen(port, () =>
    console.log(`Example app listening on port ${port}!`)
)