import { supabaseAdmin } from "../config/supabase.js";

/**
 * requireAuth middleware
 * Reads Authorization: Bearer <jwt> header, verifies with Supabase,
 * and attaches req.user = { id, phone, ... }.
 */
export async function requireAuth(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authentication required. Please log in.",
    });
  }

  const token = authHeader.slice(7);

  try {
    const { data, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !data?.user) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired session. Please log in again.",
      });
    }

    req.user = data.user;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(500).json({
      success: false,
      message: "Authentication service error.",
    });
  }
}

/**
 * optionalAuth middleware
 * Like requireAuth but doesn't block the request if no token is provided.
 * Sets req.user = null if unauthenticated.
 */
export async function optionalAuth(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    req.user = null;
    return next();
  }

  const token = authHeader.slice(7);

  try {
    const { data } = await supabaseAdmin.auth.getUser(token);
    req.user = data?.user || null;
  } catch {
    req.user = null;
  }

  next();
}
