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
      jwtFromRequest: ExtractJwt.fromHeader('token'),
    },
    async (payload: { data: IUser }, done) => {
      try {
        const user = await UserModel.findById(payload.data._id).exec();

        if (user) {
          return done(null, user);
        }

        done(null, false);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

// Serialize function is saved in session, we call it with user.id so that deserialize function get retreive user object from this id
// The reason we get user object here is that we call done() with user object as an argument in passport.use()
passport.serializeUser((user: IUser, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  UserModel.findById(id, (err, user) => {
    done(err, user);
  })
    .populate('-password')
    .exec();
});

export { passport };
