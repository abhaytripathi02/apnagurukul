const passport = require('passport');
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const dotenv = require("dotenv");

dotenv.config();

passport.use(new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback",
    passReqToCallback   : true
  },

  function(request, accessToken, refreshToken, profile, done) {

    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return done(err, user);
    });

  }
));

passport.serializeUser((user, done) => {
  if(user){
    done(null, user);
  }
  else{
    done(null, false);
  }
});

passport.deserializeUser((user,done)=>{
  console.log('deserialize user called');
  done(null, user);
})