const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'uploads/posts/';

        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const sanitizedFileName = file.originalname.replace(/[^a-zA-Z0-9.-_]/g, '');
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(sanitizedFileName));
    }
});

const limits = { fileSize: 5 * 1024 * 1024 }; 

const upload = multer({ storage: storage, limits: limits }); 

module.exports = { upload };
