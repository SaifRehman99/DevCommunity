const keys = require("./keys");
const User = require("../models/User");

const googleStrategy = require("passport-google-oauth20").Strategy;

module.exports = function(passport) {
    passport.use(
        new googleStrategy({
                clientID: keys.googleClientID,
                clientSecret: keys.googleSecretID,
                callbackURL: "/auth/google/callback",
                proxy: true
            },
            (accessToken, refreshToken, profile, done) => {
                let userData = {
                    googleID: profile.id,
                    email: profile.emails[0].value,
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName,
                    image: profile.photos[0].value
                };

                User.findOne({ googleID: profile.id })
                    .then(user => {
                        if (user) {
                            // if user exist, return
                            return done(null, user);
                        } else {
                            // creating user here
                            User.create(userData)
                                .then(data => done(null, data))
                                .catch(error => console.log(error));
                        }
                    })
                    .catch(err => console.log(err));
            }
        )
    );

    passport.serializeUser(function(data, done) {
        done(null, data.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
};