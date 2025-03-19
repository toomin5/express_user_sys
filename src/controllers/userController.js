import express from "express";
import userService from "../services/userService.js";
import verifySessionLogin from "../middlewares/sessionAuth.js";
import auth from "../middlewares/jwtAuth.js";

const userController = express.Router();

// 회원가입
userController.post("/users", async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);
    return res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

// 토큰 기반 로그인
userController.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await userService.getUser(email, password);
    const accessToken = userService.createToken(user);
    const refreshToken = userService.createToken(user, "refresh");
    await userService.updateUser(user.id, { refreshToken });
    res.cookie("refreshToken", refreshToken, {
      path: "/token/refresh",
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    return res.json({ accessToken });
  } catch (error) {
    next(error);
  }
});

userController.post(
  "/token/refresh",
  auth.verifyRefreshToken,
  async (req, res, next) => {
    try {
      const { refreshToken } = req.cookies; //client가 전달한 리프레쉬토큰
      const { userId } = req.auth;
      const { accessToken, newRefreshToken } = await userService.refreshToken(
        userId,
        refreshToken
      );
      await userService.updateUser(userId, { refreshToken: newRefreshToken });
      res.cookie("refreshToken", newRefreshToken, {
        path: "/token/refresh",
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
      return res.json({ accessToken });
    } catch (error) {
      next(error);
    }
  }
);

// 세션 기반 로그인
userController.post("/session-login", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await userService.getUser(email, password);
    console.log(req.session);
    req.session.userId = user.id;
    return res.json(user);
  } catch (error) {
    next(error);
  }
});

// 세션 기반 로그아웃
userController.post(
  "/session-logout",
  verifySessionLogin,
  async (req, res, next) => {
    console.log("logout");
    console.log(req.session);
    req.session.destroy();
    res.status(200).send();
  }
);

export default userController;
