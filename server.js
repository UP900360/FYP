/* eslint-disable no-unused-vars */
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const sqlite3 = require('sqlite3').verbose();
const db2 = new sqlite3.Database('database.sqlite');
const uuid = require('uuid-random');
const multer = require('multer');
const fs = require('fs');
const express = require('express');
const app = express();
const port = 8080;

// upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
// File filtering only accepts files defined
const fileFilter = function (req, file, cb) {
  if (!file.originalname.match(/\.(js|JS|html|HTML|css|CSS|sql|SQL|py|PY|java|Java)$/)) {
    req.fileValidationError = 'Wrong file type, try a different file type';
    return cb(new Error('Wrong file type, try a different file type'), false);
  }
  cb(null, true);
};
const upload = multer({ storage: storage, fileFilter: fileFilter });
// Counts string length to give similarity Percentage
function getStringLengthOfArray(array) {
  let length = 0;
  for (const item of array) {
    length = length + item.length;
  }
  return length;
}

// Compares two strings and return similar content as an array
function getSimilarContent(first, second) {
  const common = [];
  let firstContent = first.replace(/\r/g, '');
  firstContent = firstContent.replace(/{/g, '');
  firstContent = firstContent.replace(/}/g, '');
  const secondContent = second.replace(/\s/g, '');
  let items = firstContent.split('\n');
  items = items.filter(i => i !== '');
  for (const item of items) {
    if (secondContent.includes(item.trim().replace(/\s/g, ''))) {
      common.push(item);
    }
  }
  return {
    similarContent: common,
    similarity: getStringLengthOfArray(common) / getStringLengthOfArray(items),
  };
}

// Reads full files and returns the similarity results
function readFiles(dirName, fileName) {
  const indexes = [];
  const contentUploading = fs.readFileSync(dirName + fileName, 'utf8');
  const files = fs.readdirSync(dirName);
  let i = 0;
  files.forEach(function (file) {
    if (i !== 0 && fileName !== file) {
      const UploadedContent = fs.readFileSync(dirName + file, 'utf8');
      const { similarity, similarContent } = getSimilarContent(contentUploading, UploadedContent);
      indexes.push({
        file,
        content: contentUploading,
        similarity,
        similarContent,
      });
      console.log('Reading next file ');
    }
    i++;
  });

  return indexes;
}
// uploads file
app.post('/uploadfile', upload.single('myFile'), (req, res, next) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ error: 'please upload a file' });
  }

  // Inserts file name/id and path in the database
  db2.serialize(() => {
    db2.run('INSERT INTO uploadedFiles(file_id,file_name, file_path) VALUES(?,?,?)', [uuid(), file.originalname, file.path], function (err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      } else {
        const resultArray = readFiles('uploads/', file.originalname);
        return res.status(201).json(
          {
            'file-id': this.changes,
            'indexes': resultArray,
          },
        );
      }
    });
  });
});

app.use(express.static('Website'));

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
