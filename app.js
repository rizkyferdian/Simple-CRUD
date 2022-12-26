const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const session = require('express-session')
const flash = require('connect-flash')
const mongoose = require('mongoose')

const Contact = require('./model/contact')


const app = express()
const port = 3000

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