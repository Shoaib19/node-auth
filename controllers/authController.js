const User = require('../models/user');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const MAXAGE = 3 * 24 * 60 * 60;

const handleError = (err) => {
    let errors = {email: '', password: ''};

    if(err.message == "email error") {
        errors['email'] = "You sure you registered with us";
    }
    if(err.message == "password error") {
        errors['password'] = 'Ahah wrong password man :(';
    }
    if (err.code == 11000){
        errors.email = "this user is already in DB";
        return errors;
    }
    if(err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(({properties}) => {
           errors[properties.path] = properties.message;
        })
    }
    return errors;
}

const createToken = (id) => {
    return jwt.sign({id}, process.env.SECRET,{
        expiresIn: MAXAGE
    })
}

module.exports.signupGet = (req,res) =>  {
    res.render('signup');
}

module.exports.signupPost = async (req,res) =>  {
    const { email, password } = req.body;
    try {
     const user =  await User.create({ email, password})
     let token = createToken(user._id);
     res.cookie('jwt', token, { httpOnly: true, maxAge: MAXAGE * 1000});
     res.status(201).json({user: user._id});

    } catch (err) {
        let errors = handleError(err)
        res.status(400).json({ errors })
    }
}

module.exports.loginGet = (req,res) =>  {
    res.render('login');
}

module.exports.loginPost = async (req,res) =>  {
    const { email, password } = req.body;
    try {
     const user =  await User.login(email, password);
     let token = createToken(user._id)
     res.cookie('jwt', token, { httpOnly: true, maxAge: MAXAGE * 1000 })
     res.status(200).json(user);
    } catch (err) {
        let errors = handleError(err)
        res.status(400).json({ errors });
    }
}

module.exports.logout = (req,res) =>  {
    res.cookie('jwt', null, { httpOnly: true, maxAge: 1});
    res.redirect('/login');
}