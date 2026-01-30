import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";

export function generateToken(username) {
  return jwt.sign({ username }, JWT_SECRET, {
    expiresIn: "2h"
  });
}

export function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Missing token" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Invalid token format" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { email, userId }
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
}
