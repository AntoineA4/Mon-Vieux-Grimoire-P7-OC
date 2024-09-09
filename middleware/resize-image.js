const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

exports.resizeImages = (req, res, next) => {
  const { file } = req;

  if (!req.file) {
    return next();
  }
  const filePath = req.file.path;
  const outputFileName = `resized-${file.originalname}`;
  const outputFilePath = path.join(__dirname, '..', 'public', 'images', outputFileName);

  try {
    sharp(file.path)
      .resize({ width: 210, height: 260 })
      .toFile(outputFilePath)
      .then(() => fs.unlink(filePath, () => {
      }));
  } catch (error) {
    return res.status(500).json({ error });
  }
  req.file.filename = outputFileName;
  return next();
};
