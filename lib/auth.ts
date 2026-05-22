import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
export function signAccessToken(payload:any){ return jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, { expiresIn: "15m" }); }
export function signRefreshToken(payload:any){ return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, { expiresIn: "7d" }); }
export function verifyRefreshToken(token:string){ return jwt.verify(token, process.env.JWT_REFRESH_SECRET!); }
export async function comparePassword(password:string, hash:string){ return bcrypt.compare(password, hash); }
