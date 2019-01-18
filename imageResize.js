/* 1. Load a file
   2. resize the file
   3. save the file using a different filename  */


const fs = require('fs');
const sharp = require('sharp');

// helpers

const getExtension = filename => {
  const parts = filename.split('.');
  return parts[parts.length - 1];
}

const isImage = filename => {
  // rudimentary check based on file extension -- no check inside the file itself for e.g. byte structure
  const ext = getExtension(filename);
  switch (ext.toLowerCase()) {
  case 'jpg':
  case 'gif':
  case 'bmp':
  case 'png':
    return true;
  }
  return false;
}

// reads file

const readImageFile = filename => {
  return new Promise((resolve, reject) => {
    // check if we're dealing with an image
    if (!isImage(filename))
      return reject('File is not an image.');
    fs.readFile(filename, (err, data) => {
      if(err) {
        reject(err);
      } else {
        resolve(data);
      }
    })
  })
}

const resize = (filebuffer, size) => {
  // returns a promise
  return sharp(filebuffer)
    .resize(size)
    .toFile('img/image1-resized.jpg');
}

readImageFile('img/image1.jpg')
  .then(res => {
    // res contains the image buffer
    // we resolve the promise with a thenable
    return resize(res, 400);
  })
  .then(res => {
    console.log(res)
  })
  .catch(error => {
    console.log(error);
  })