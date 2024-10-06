const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user'); // Adjust path if necessary

module.exports = function(passport) {
  passport.use(new LocalStrategy(
    {
      usernameField: 'email', // Use email instead of username
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        // Find user by email
        const user = await User.findOne({ email });
        
        if (!user) {
          return done(null, false, req.flash('error', 'No user found with that email.'));
        }
        const expectedRole = req.body.role; // Assuming role is sent through the login form
        if (user.role !== expectedRole) {
          return done(null, false, req.flash('error', 'Unauthorized role.'));
        }
        // Check password
        user.authenticate(password, (err, result) => {
          if (err || !result) {
            return done(null, false, req.flash('error', 'Invalid password.'));
          }

          return done(null, user);
        });
      } catch (err) {
        return done(err);
      }
    }
  ));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};
