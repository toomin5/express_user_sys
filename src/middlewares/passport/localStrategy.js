import { Strategy as localStrategy } from "passport-local";
import userService from "../../services/userService";

// 첫번째 옵션으로 usernameField라는 프로퍼티로 이메일을 전달
// api스펙을 이메일과 패스워드로 설정했기때문에 이메일을 유저네임필드를 이메일로 변경
const localStrategy = new localStrategy(
  {
    usernameField: "email",
  },
  async (email, password, done) => {
    try {
      const user = await userService.getUser(email, password);
      if (!user) {
        return done(null, false);
      } //	첫 번째 인자: null → 에러 없음
      //	두 번째 인자: false → 인증 실패
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
);

export default localStrategy;
