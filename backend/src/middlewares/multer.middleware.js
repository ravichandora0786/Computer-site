/**
 * multer Middleware for image/document upload
 */

import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 } from "uuid";
import { ApiError } from "../utils/ApiError.js";

// Define the base media directory
const mediaBaseDir = path.join("public", "media");

// Ensure the base directory exists
if (!fs.existsSync(mediaBaseDir)) {
  fs.mkdirSync(mediaBaseDir, { recursive: true });
}

// Storage configuration with dynamic folder support
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determine the target folder (course, user, etc.) from query or default to 'general'
    const subFolder = req.query.folder || "general";
    const targetDir = path.join(mediaBaseDir, subFolder);

    // Create the subdirectory if it doesn't exist
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    
    cb(null, targetDir);
  },
  filename: (req, file, cb) => {
    const cleanFileName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const uniqueFilename = `${Date.now()}_${cleanFileName}`;
    cb(null, uniqueFilename);
  },
});

// File validation
const imageFilter = (req, file, cb) => {
  const allowedImageTypes = /jpeg|jpg|png/;
  const extName = allowedImageTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimeType = allowedImageTypes.test(file.mimetype);

  if (extName && mimeType) {
    return cb(null, true);
  } else {
    return cb(new ApiError(400, "Only images (jpeg, jpg, png) are allowed"));
  }
};

const documentFilter = (req, file, cb) => {
  const allowedDocTypes = /pdf|msword|doc|docx/;
  const extName = allowedDocTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimeType = allowedDocTypes.test(file.mimetype);

  if (extName && mimeType) {
    return cb(null, true);
  } else {
    return cb(new ApiError(400, "Only documents (pdf, doc, docx) are allowed"));
  }
};

const mediaFilter = (req, file, cb) => {
  const allowedMediaTypes = /jpeg|jpg|png|webp|mp4|mov/;
  const extName = allowedMediaTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimeType = allowedMediaTypes.test(file.mimetype);

  if (extName && mimeType) {
    return cb(null, true);
  } else {
    return cb(new ApiError(400, "Only Images (JPG, PNG, WEBP) and Videos (MP4, MOV) are allowed"));
  }
};

// Multer configurations
const uploadImageConfig = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});

const uploadDocumentConfig = multer({
  storage,
  fileFilter: documentFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const uploadMediaConfig = multer({
  storage,
  fileFilter: mediaFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB for videos
});

// Middlewares
export const uploadImage = (fieldName) => (req, res, next) => {
  uploadImageConfig.single(fieldName)(req, res, (err) => {
    if (err instanceof multer.MulterError)
      return res.status(400).json({ message: `Multer error: ${err.message}` });
    else if (err) return res.status(400).json({ message: err.message });
    next();
  });
};

export const uploadDocument = (fieldName) => (req, res, next) => {
  uploadDocumentConfig.single(fieldName)(req, res, (err) => {
    if (err instanceof multer.MulterError)
      return res.status(400).json({ message: `Multer error: ${err.message}` });
    else if (err) return res.status(400).json({ message: err.message });
    next();
  });
};

export const uploadMultiImage = (fieldName) => (req, res, next) => {
  uploadImageConfig.array(fieldName, 5)(req, res, (err) => {
    if (err instanceof multer.MulterError)
      return res.status(400).json({ message: `Multer error: ${err.message}` });
    else if (err) return res.status(400).json({ message: err.message });
    next();
  });
};

export const uploadMedia = (fieldName) => (req, res, next) => {
  uploadMediaConfig.single(fieldName)(req, res, (err) => {
    if (err instanceof multer.MulterError)
      return res.status(400).json({ message: `Multer error: ${err.message}` });
    else if (err) return res.status(400).json({ message: err.message });
    next();
  });
};
