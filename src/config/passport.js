const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const { User } = require('../app/models');

const params = {
  secretOrKey: process.env.AUTH_SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

module.exports = () => {
  const strategy = new Strategy(params, (payload, done) => {
    User.findOne({
      email: payload.email
    })
      .then(user => {
        done(null, user ? { ...payload } : false);
      })
      .catch(err => done(err, false));
  });

  passport.use(strategy);

  return {
    authenticate: () =>
      passport.authenticate('jwt', { session: false })
  };
};
