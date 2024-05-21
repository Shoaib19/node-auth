const User = require('../models/user')


const handleError = (err) => {
    let errors = {email: '', password: ''};

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

module.exports.signupGet = (req,res) =>  {
    res.render('signup');
}

module.exports.signupPost = async (req,res) =>  {
    const { email, password } = req.body;
    try {
     const user =  await User.create({ email, password})
     res.status(201).json(user);
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
     const user =  await User.findBy({ email, password})
     res.status(200).json(user);
    } catch (err) {
        let errors = handleError(err)
        res.status(400).json({ errors });
    }
}

module.exports.logout = (req,res) =>  {
    
}