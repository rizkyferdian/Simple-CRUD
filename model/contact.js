const mongoose = require('mongoose')


const contactSchema = mongoose.Schema({
    nama: {
        type: String,
        required: true,
    },
    nohp: {
        type: String,
        required: true,
    },
    email: {
        type: String
    }
})

module.exports = mongoose.model("Contact", contactSchema);