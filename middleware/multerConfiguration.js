const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, callback) => {
    callback(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
  fileFilter: (req, file, callback) => {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/webp'
    )
      callback(null, true);
    else callback(new Error('Only png, jpg, jpeg format allowed'));
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
