const localStrategy = require('passport-local').Strategy;
//will see if we do this
//const bcrypt = require('bcrypt');
function init(passport, getUserByUsername, getUserById) {
    const authenticateUser = (username, password, done) => {
        const user = getUserByUsername(username);
        if (user == null) {
            return done(null, false, { message: 'No user with that username'});
        }

        try {
            if (password == user.password) {
                return done(null, user);
            }
            else {
                return done(null, false, { message: 'Password incorrect'});
            }
        } catch (e) {
           console.log("its jumped in here"); 
           return done(e);
            
        }
    }

    passport.use(new localStrategy({ usernameField: 'username'}, authenticateUser));
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => {
        return done(null, getUserById(id));
    } )
}

module.exports = init;