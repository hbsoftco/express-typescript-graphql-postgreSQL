import argon from "argon2";

export const hashPassword = async (password: string) => {
  const hashedPassword = await argon.hash(password);
  return hashedPassword;
};

export const verifyPassword = async (
  inputPassword: string,
  passwordHash: string
) => {
  const isCorrect = await argon.verify(passwordHash, inputPassword);
  return isCorrect;
};
