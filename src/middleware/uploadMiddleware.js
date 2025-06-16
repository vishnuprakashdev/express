import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure upload directory exists
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    const timestamp = Date.now();
    cb(null, `${name}-${timestamp}${ext}`);
  },
});

// File type filter (optional, adjust as needed)
const fileFilter = (req, file, cb) => {
  // Accept all for now, or customize:
  // if (file.mimetype.startsWith('image/')) cb(null, true);
  // else cb(new Error('Only images are allowed'), false);
  cb(null, true);
};

// Export multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

export default upload;

/*
import express from 'express';
import upload from './middleware/uploadMiddleware.js';

const router = express.Router();

// Single file
router.post('/upload/single', upload.single('file'), (req, res) => {
  res.success({ file: req.file });
});

// Multiple files
router.post('/upload/multiple', upload.array('files', 5), (req, res) => {
  res.success({ files: req.files });
});

// Field-wise multiple files
router.post('/upload/fields', upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'documents', maxCount: 3 }
]), (req, res) => {
  res.success({ files: req.files });
});

export default router;

*/