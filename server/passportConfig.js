/**
 * Refrences:
 * https://www.passportjs.org/packages/passport-local/
 * clarifications:
 * passport expects an object in the request body exactly as: {
    "username": "sx@",
    "password": "s"
    }
 */


import LocalStrategy from 'passport-local'
import bcrypt from 'bcrypt'

function initializePassport(passport, db) {
    const authenticateUser = async (email, password, done) => {

        //get user from db
        const user = await db.collection('users').findOne({ "email": email })
        //console.log(user)
        if (!user) {
            return done(null, false, { message: "email/user doesn't exist" })
        }

        //user exists, hash the recieved password and check if they match
        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user)
            } else {
                return done(null, false, { message: 'Incorrect password' })
            }
        } catch (error) {
            return done(error)
        }
    }

    passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, authenticateUser));

    //set what data to store in the session cookie / data to send back to client
    passport.serializeUser(function (user, cb) {
        process.nextTick(function () {
            cb(null, {
                _id: user._id, username: user.username, email: user.email,
                isAdmin: user.isAdmin
            });
        });
    });

    passport.deserializeUser(function (user, cb) {
        process.nextTick(function () {
            return cb(null, user);
        });
    });

}



export default initializePassport


