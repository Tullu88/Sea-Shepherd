const passport = require('passport');
const twitchStrategy = require('passport-twitch-new').Strategy;
require('dotenv').config();

passport.use(
    new twitchStrategy({
        // options for the google strat
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: 'http://localhost:5000/auth/twitch/redirect',
        //scope: "user_read"
        scope: "channel:read:subscriptions user:read:subscriptions"
    }, (accessToken, refreshToken, profile, done) => {
        //passport callback function  
        console.log('passport callback function fired');
        console.log(profile);
        
    })
);

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});