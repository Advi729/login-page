var express = require('express');
var router = express.Router();

// GET login page.
router.get('/',(req, res) => {
    if(req.session.user) {
        res.redirect('/home');
    } else {
        res.render('index', {title: 'Login Page', 'loginError': req.session.loginError});
        req.loginError = false;
    }
  })

const credential = {
    email:'adal@gmail.com',
    password: 'adal123'
}

// POST home page
router.post('/login', (req, res) => {

    if(req.body.email == credential.email && req.body.password == credential.password) {
        req.session.user = req.body.email;
        res.redirect('/home');
    } else {
        req.session.loginError = true;
        res.redirect('/');
    }
});

module.exports = router;
  