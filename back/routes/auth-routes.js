const passport = require('passport');
const router = require('express').Router();
var twitchStrategy = require("passport-twitch-new").Strategy;


// auth login
router.get('/login', (req, res) => {
    res.send('login');
});

//auth Logout
router.get('/logout', (req, res) => {
    //handle with passport
    res.send('logging out');
});

// auth with twitch
router.get('/twitch', passport.authenticate('twitch', {forceVerify: true}));

//callback route for twitch to redirect to
router.get('/twitch/redirect', passport.authenticate('twitch', { failureRedirect: "/" }), (req, res) => {
    res.send('You reached a callback URI');
    console.log('callback uri reached');
    res.redirect("/");
});

module.exports = router;