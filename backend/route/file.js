const express = require('express');
const router = express.Router();
const multer = require('multer');
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const crypto = require('crypto');

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Configure S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME;

// Helper function to generate unique filename
function generateUniqueFilename(originalFilename) {
  const timestamp = Date.now().toString();
  const randomString = crypto.randomBytes(8).toString('hex');
  const hash = crypto.createHash('sha256').update(timestamp + randomString).digest('hex');

  const extension = originalFilename.split('.').pop();
  return `${hash.substring(0, 32)}-${timestamp}.${extension}`;
}

// POST /api/files/upload - Upload file to S3
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const uniqueFilename = generateUniqueFilename(req.file.originalname);
    
    const uploadParams = {
      Bucket: BUCKET_NAME,
      Key: uniqueFilename,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };

    try {
      await s3Client.send(new PutObjectCommand(uploadParams));
      
      // Construct the file URL
      const fileUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueFilename}`;
      
      return res.status(200).json({
        success: true,
        url: fileUrl,
        filename: uniqueFilename,
        originalName: req.file.originalname
      });
    } catch (s3Error) {
      console.error('S3 Upload Error:', s3Error);
      
      // Check if it's a collision (extremely rare)
      if (s3Error.Code === 'EntityAlreadyExists') {
        return res.status(409).json({ 
          error: 'File collision detected. Please try again.' 
        });
      }
      
      return res.status(500).json({ 
        error: 'Failed to upload file to S3' 
      });
    }
  } catch (error) {
    console.error('Upload Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/files/:filename - Delete file from S3
router.delete('/:filename', async (req, res) => {
  try {
    const { filename } = req.params;

    if (!filename) {
      return res.status(400).json({ error: 'Filename is required' });
    }

    const deleteParams = {
      Bucket: BUCKET_NAME,
      Key: filename,
    };

    await s3Client.send(new DeleteObjectCommand(deleteParams));

    return res.status(200).json({
      success: true,
      message: 'File deleted successfully',
      filename
    });
  } catch (error) {
    console.error('Delete Error:', error);
    return res.status(500).json({ error: 'Failed to delete file' });
  }
});

module.exports = router;