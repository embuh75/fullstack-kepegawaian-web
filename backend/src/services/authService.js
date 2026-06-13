const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwt");
const prisma = require("../config/database");

const generateAccessToken = (userId, roleId) =>
  jwt.sign({ userId, roleId }, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn,
  });
const generateRefreshToken = (userId) =>
  jwt.sign({ userId }, jwtConfig.refreshSecret, {
    expiresIn: jwtConfig.refreshExpires,
  });

const login = async ({ username, password }) => {
  const user = await prisma.user.findFirst({
    where: { OR: [{ username }, { email: username }] },
    include: {
      role: { include: { permissions: { include: { permission: true } } } },
    },
  });
  if (!user) throw { statusCode: 401, message: "Username atau password salah" };
  if (!user.isAktif) throw { statusCode: 401, message: "Akun tidak aktif" };
  if (!(await bcrypt.compare(password, user.password)))
    throw { statusCode: 401, message: "Username atau password salah" };

  await prisma.refreshToken.deleteMany({
    where: { userId: user.id, expiresAt: { lt: new Date() } },
  });

  const accessToken = generateAccessToken(user.id, user.roleId);
  const refreshToken = generateRefreshToken(user.id);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await prisma.refreshToken.create({
    data: { token: refreshToken, userId: user.id, expiresAt },
  });
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date() },
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role.nama,
      permissions: user.role.permissions.map((rp) => rp.permission.nama),
    },
  };
};

const refresh = async (refreshToken) => {
  let decoded;
  try {
    decoded = jwt.verify(refreshToken, jwtConfig.refreshSecret);
  } catch {
    throw {
      statusCode: 401,
      message: "Refresh token tidak valid atau kedaluwarsa",
    };
  }

  const stored = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
  });
  if (!stored || stored.expiresAt < new Date())
    throw { statusCode: 401, message: "Refresh token kedaluwarsa" };

  const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
  if (!user || !user.isAktif)
    throw { statusCode: 401, message: "User tidak valid" };

  const newAccess = generateAccessToken(user.id, user.roleId);
  const newRefresh = generateRefreshToken(user.id);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await prisma.refreshToken.update({
    where: { token: refreshToken },
    data: { token: newRefresh, expiresAt },
  });
  return { accessToken: newAccess, refreshToken: newRefresh };
};

const logout = async (refreshToken) => {
  await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
};

const changePassword = async (userId, { passwordLama, passwordBaru }) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw { statusCode: 404, message: "User tidak ditemukan" };
  if (!(await bcrypt.compare(passwordLama, user.password)))
    throw { statusCode: 400, message: "Password lama tidak sesuai" };
  const hashed = await bcrypt.hash(passwordBaru, 12);
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashed },
  });
  await prisma.refreshToken.deleteMany({ where: { userId } });
};

module.exports = { login, refresh, logout, changePassword };
