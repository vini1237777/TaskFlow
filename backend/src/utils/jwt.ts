import jwt, { SignOptions } from 'jsonwebtoken';

interface TokenPayload {
  userId: string;
  email: string;
}

interface RefreshTokenPayload {
  userId: string;
  tokenId: string;
}

export const generateAccessToken = (payload: TokenPayload): string => {
  const secret = process.env.JWT_ACCESS_SECRET!;
  const expiresIn = (process.env.JWT_ACCESS_EXPIRES_IN || '15m') as SignOptions['expiresIn'];
  return jwt.sign(payload, secret, { expiresIn });
};

export const generateRefreshToken = (payload: RefreshTokenPayload): string => {
  const secret = process.env.JWT_REFRESH_SECRET!;
  const expiresIn = (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as SignOptions['expiresIn'];
  return jwt.sign(payload, secret, { expiresIn });
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as TokenPayload;
};

export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as RefreshTokenPayload;
};

export const getRefreshTokenExpiry = (): Date => {
  const days = parseInt(process.env.JWT_REFRESH_EXPIRES_IN?.replace('d', '') || '7');
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + days);
  return expiry;
};
