import passport from "passport";
import localStrategy from "../middlewares/passport/localStrategy.js";

passport.use("local", localStrategy);

export default passport;
