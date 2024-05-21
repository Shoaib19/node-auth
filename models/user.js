const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'email is required'],
        unique: true,
        validate: [isEmail, 'email should be valid']
    },
    password: {
        type: String,
        required: [true, 'password is required'],
        minLength: [6, 'password must be at least 6 characters']
    },
})


// mongoose hooks post and pre

// userSchema.post('save', function (doc, next) {
//     console.log("********",doc);
//     next();
// })

userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

const User = mongoose.model('user', userSchema);

module.exports = User;