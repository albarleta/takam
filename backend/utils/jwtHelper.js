import jwt from "jsonwebtoken";

export const generateAccessToken = (userInfo) => {
  return jwt.sign(
    {
      userId: userInfo._id,
      email: userInfo.email,
      username: userInfo.username,
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
    },
    process.env.ACCESS_TOKEN_SECRET_KEY,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
    }
  );
};

export const generateRefreshToken = (userInfo) => {
  return jwt.sign(
    {
      userId: userInfo._id,
      email: userInfo.email,
      username: userInfo.username,
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
    },
    process.env.REFRESH_TOKEN_SECRET_KEY,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
    }
  );
};
