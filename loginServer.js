if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');

const initializePassport = require('./passport-config');

initializePassport(
    passport, 
    username =>users.find(user => user.username === username),
    id => users.find(user => user.id === id)
    );

const users = [ { id: '1',
                username: 'bob',
                password: '1234abcd'
}];

app.use(express.static(__dirname + '/public'));
app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: false}));
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
    res.render('test.ejs', { name: 'dude' });
});

app.get('/login', (req, res) => {
    res.render('login.ejs');
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

//app.post('/login', (req, res) => console.log(req));
app.listen(8000);