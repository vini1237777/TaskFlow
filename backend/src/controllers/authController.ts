import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "../index";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  getRefreshTokenExpiry,
} from "../utils/jwt";
import { createError } from "../middleware/errorHandler";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, name, password } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return next(createError("Email already in use", 409));
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { email, name, passwordHash },
      select: { id: true, email: true, name: true, createdAt: true },
    });

    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
    });
    const tokenId = uuidv4();
    const refreshTokenValue = generateRefreshToken({
      userId: user.id,
      tokenId,
    });

    await prisma.refreshToken.create({
      data: {
        id: tokenId,
        token: refreshTokenValue,
        userId: user.id,
        expiresAt: getRefreshTokenExpiry(),
      },
    });

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: { user, accessToken, refreshToken: refreshTokenValue },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return next(createError("Invalid email or password", 401));
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return next(createError("Invalid email or password", 401));
    }

    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
    });
    const tokenId = uuidv4();
    const refreshTokenValue = generateRefreshToken({
      userId: user.id,
      tokenId,
    });

    await prisma.refreshToken.create({
      data: {
        id: tokenId,
        token: refreshTokenValue,
        userId: user.id,
        expiresAt: getRefreshTokenExpiry(),
      },
    });

    res.json({
      success: true,
      message: "Login successful",
      data: {
        user: { id: user.id, email: user.email, name: user.name },
        accessToken,
        refreshToken: refreshTokenValue,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return next(createError("Refresh token required", 400));
    }

    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      return next(createError("Invalid or expired refresh token", 401));
    }

    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (
      !storedToken ||
      storedToken.revoked ||
      storedToken.expiresAt < new Date()
    ) {
      return next(createError("Refresh token is invalid or revoked", 401));
    }

    await prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revoked: true },
    });

    const newAccessToken = generateAccessToken({
      userId: storedToken.user.id,
      email: storedToken.user.email,
    });
    const newTokenId = uuidv4();
    const newRefreshToken = generateRefreshToken({
      userId: storedToken.user.id,
      tokenId: newTokenId,
    });

    await prisma.refreshToken.create({
      data: {
        id: newTokenId,
        token: newRefreshToken,
        userId: storedToken.userId,
        expiresAt: getRefreshTokenExpiry(),
      },
    });

    res.json({
      success: true,
      message: "Tokens refreshed",
      data: { accessToken: newAccessToken, refreshToken: newRefreshToken },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      await prisma.refreshToken.updateMany({
        where: { token: refreshToken },
        data: { revoked: true },
      });
    }
    res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};
