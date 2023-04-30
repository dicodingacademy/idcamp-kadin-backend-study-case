const fs = require('fs');
const path = require('path');
const config = require('../../utils/config');

class LocalStorageService {
  constructor() {
    this._baseUploadFolder = path.join(process.cwd(), 'src', 'public', 'uploads');

    if (!fs.existsSync(this._baseUploadFolder)) {
      fs.mkdirSync(this._baseUploadFolder, { recursive: true });
    }
  }

  async uploadUserIdCard(userId, file, meta) {
    const filename = `card-${userId}.${meta.filename.split('.').pop()}`;

    const outputPath = path.join(this._baseUploadFolder, filename);
    const fileStream = fs.createWriteStream(outputPath);

    return new Promise((resolve, reject) => {
      fileStream.on('error', (error) => reject(error));
      file.pipe(fileStream);
      file.on('end', () => resolve(filename));
    });
  }
}

module.exports = LocalStorageService;
