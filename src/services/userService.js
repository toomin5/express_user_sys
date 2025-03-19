import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userRepository from "../repositories/userRepository.js";

function hashingPassword(password) {
  return bcrypt.hash(password, 10);
}

// 회원가입
async function createUser(user) {
  const existedUser = await userRepository.findByEmail(user.email);

  if (existedUser) {
    const error = new Error("user already exists");
    error.code = 422;
    error.data = { email: user.email };
    throw error;
  }
  // 비밀번호 해싱
  const hashedPassword = await hashingPassword(user.password);
  const createdUser = await userRepository.save({
    ...user,
    password: hashedPassword,
  });
  return filterSensitiveUserData(createdUser);
}

// 로그인
async function getUser(email, password) {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    const error = new Error("Unauthorized");
    error.code = 401;
    throw error;
  }
  verifyPassword(password, user.password);
  return filterSensitiveUserData(user);
}

async function updateUser(id, data) {
  const user = await userRepository.update(id, data);
  return user;
}

async function refreshToken(userId, refreshToken) {
  const user = await userRepository.findById(userId);
  //유저가 없거나 리프레쉬토근이 전달받은 리프레쉬토큰과 다를 경우
  if (!user || user.refreshToken !== refreshToken) {
    const error = new Error("unauthorized");
    error.code = 401;
    throw error;
  }
  const accessToken = createToken(user);
  return accessToken;
}

async function verifyPassword(inputPassword, savedpassword) {
  const isValid = await bcrypt.compare(inputPassword, savedpassword);
  if (!isValid) {
    const error = new Error("Unauthorized");
    error.code = 401;
    throw error;
  }
}

// password만 제외
function filterSensitiveUserData(user) {
  const { password, refreshToken, ...rest } = user;
  return rest;
}

function createToken(user, type) {
  const payload = { userId: user.id }; //userId라는 키로 user.id를 할당
  const options = {
    expiresIn: type === "refresh" ? "2w" : "1h",
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, options);
  console.log("JWT");
  console.log(token);
  return token;
}

export default {
  createUser,
  getUser,
  createToken,
  updateUser,
  refreshToken,
};
