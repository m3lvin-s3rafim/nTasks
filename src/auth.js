require('dotenv').config();
import passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

module.exports = app => {
    const Users = app.data.Users;
    let opts = {};

    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = process.env.JWT_SECRET;

    const strategy = new Strategy(opts, (payload, done) => {
        Users.findByPk(payload.id)
            .then(user => {
                if (user) {
                    return done(null, {
                        id: user.id,
                        email: user.email
                    });
                }

                return done(null, false);
            })
            .catch(error => done(error, null));
    });

    passport.use(strategy);

    return {
        initialize: () => {
            return passport.initialize();
        },
        authenticate: () => {
            return passport.authenticate('jwt', {session: process.env.JWT_SESSION});
        }
    }
}