import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import { prisma } from "./db.utils";
import * as dotenv from "dotenv";
dotenv.config();

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser((id: string, done) => {
  prisma.user
    .findFirst({
      where: { id },
    })
    .then((user: any) => {
      done(null, user);
    })
    .catch((err) => done(err, null));
});

passport.use(
  new GoogleStrategy(
    {
      callbackURL: "/auth/google/callback",
      clientID: "358279848449-leqhbv27d5hi8u76p6i595hd4ado657m.apps.googleusercontent.com",
      clientSecret:"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",
      proxy: true,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: (error: any, user?: any) => void
    ) => {
      try {
        const existingUser = await prisma.user.findFirst({
          where: {
            googleId: profile.id,
          },
        });
        if (existingUser) {
          return done(null, existingUser);
        }
        const user = await prisma.user.create({
          data: {
            displayName: profile.displayName || "",
            googleId: profile.id || "",
          },
        });
        done(null, user);
      } catch (err: any) {
        done(err, null);
      }
    }
  )
);

export { passport };
