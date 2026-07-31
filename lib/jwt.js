import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "chat-roleplay-jwt-secret-key-2026-secure";
const key = new TextEncoder().encode(JWT_SECRET);

/**
 * Creates a signed JWT token.
 * @param {object} payload - Claims to include in the payload (e.g. { userId, name })
 * @param {string} expiresIn - Token expiration time string (e.g. '30d')
 * @returns {Promise<string>} Signed JWT string
 */
export async function createAuthToken(payload, expiresIn = "30d") {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(key);
}

/**
 * Verifies a JWT token signature and expiration.
 * @param {string} token - The JWT token string
 * @returns {Promise<object|null>} Decoded payload if valid, otherwise null
 */
export async function verifyAuthToken(token) {
  try {
    if (!token) return null;
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    return null;
  }
}
