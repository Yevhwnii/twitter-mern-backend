import passport from 'passport';
import LocalStrategy from 'passport-local';
import JWTStragery, { ExtractJwt } from 'passport-jwt';

import { IUser, UserModel } from '../models/User';
import { generateMD5 } from '../utils/generateHash';

passport.use(
  new LocalStrategy.Strategy(async function (
    username,
    password,
    done
  ): Promise<void> {
    try {
      const user = await UserModel.findOne({
        $or: [{ username: username }, { email: username }],
      }).exec();

      if (!user) {
        return done(null, false, { message: 'Invalid credentials' });
      }

      if (user.password === generateMD5(process.env.SECRET_KEY + password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Invalid credentials' });
      }
    } catch (error) {
      done(error, false);
    }
  })
);

passport.use(
  new JWTStragery.Strategy(
    {
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    async (payload, done) => {
      try {
        return done(null, payload.user);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.serializeUser((user: IUser, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  UserModel.findById(id, (err, user) => {
    done(err, user);
  }).exec();
});

export { passport };
