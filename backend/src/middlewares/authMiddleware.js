/**
 * Auth Middleware
 */

import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import hasPermission from "../utils/abac.js";
import { BlockedTokenModel } from "../models/associations.js";

/**
 * Middleware to authenticate a user based on the JWT token provided in the
 * Authorization header.
 */
export const authenticateUser = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
      return next(new ApiError(401, "Access denied. No token provided."));
    }

    // Check if blocked
    const blockedToken = await BlockedTokenModel.findOne({
      where: { token },
    });

    if (blockedToken) {
      return next(new ApiError(401, "Token blocked. Please login again."));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "super_secret");
    req.user = decoded;
    next();
  } catch (err) {
    return next(new ApiError(401, err.message || "Invalid or expired token"));
  }
};

/**
 * Middleware to optionally extract user from token without forcing authentication.
 */
export const extractUser = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];
    if (token) {
      // Check if blocked
      const blockedToken = await BlockedTokenModel.findOne({
        where: { token },
      });
      if (!blockedToken) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "super_secret");
        req.user = decoded;
      }
    }
    next();
  } catch (err) {
    // We ignore errors here because authentication is optional
    next();
  }
};

/**
 * Authorization middleware
 * @param {string} action - The action to check (e.g., create, read)
 * @param {string} activityName - The activity name
 */
export const authorizeUser =
  (action, activityName) => async (req, res, next) => {
    try {
      const allowed = await hasPermission(req.user, action, activityName);
      if (allowed) {
        next();
      } else {
        next(new ApiError(403, "Access denied. Insufficient permissions."));
      }
    } catch (err) {
      next(err);
    }
  };
