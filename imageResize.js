/** 
 * Module imageResize - Resizes a series of images.
 * @module imageResize
*/


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

// reads an image file

const readImageFile = filename => {
  return new Promise((resolve, reject) => {
    // check if we're dealing with an image
    if (!isImage(filename))
      return reject(`${filename}: File is not an image.`);
    fs.readFile(filename, (err, data) => {
      if(err) {
        reject(err);
      } else {
        resolve(data);
      }
    })
  })
}

// uses the sharp library to resize a file

const resize = (filebuffer, size) => {
  // returns a promise
  return sharp(filebuffer)
    .resize(size)
    .toFile('img/image1-resized.jpg');
}

/**
 * Public function imageResize -- loads and resizes a single image.
 * @param {string} filename 
 * @param {int} size 
 */

const imageResize = (filename, size) => {
  if (!Number.isInteger(size)) {
    console.log('Size must be a number.');
    return;
  }
  readImageFile(filename)
    .then(res => {
      // res contains the image buffer
      // we resolve the promise with a thenable
      return resize(res, size);
    })
    .then(res => {
      console.log(res)
    })
    .catch(error => {
      console.log(error);
    })
}

exports.resize = imageResize;