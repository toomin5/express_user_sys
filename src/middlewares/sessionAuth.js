import userRepository from "../repositories/userRepository.js";

function throwUnauthorizedError() {}

export default async function verifySessionLogin(req, res, next) {
  try {
    console.log(req.session);
    const { userId } = req.session;

    if (!userId) {
      throwUnauthorizedError();
    }

    const user = await userRepository.findById(userId);

    if (!user) {
      console.log(`No user${userId} on DB`);
      throwUnauthorizedError();
    }

    req.user = {
      id: userId,
      email: user.email,
      name: user.name,
    };

    next();
  } catch (error) {
    next(error);
  }
}
