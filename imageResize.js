/** 
 * Module imageResize - Resizes a series of images.
 * @module imageResize
*/

const fs = require('fs');
const sharp = require('sharp');

// helpers

const getDirContents = (dir) => {
  return new Promise((resolve, reject) => {
    // check if directory exists
    if (!fs.existsSync(dir)) {
      return reject(`${dir}: Directory does not exist.`);
    }
    fs.readdir(dir, (err, files) => {
      if(err) {
        reject(err);
      } else {
        resolve(files);
      }
    })
  })
}

// loads, resizes and saves a single image
const resizeSingleImage = (input, output, size) => {
  if (!Number.isInteger(size)) {
    console.log('Size is missing or not a number');
    return;
  }

  // returns a promise
  return sharp(input)
    .resize(size)
    .toFile(output)
}

/**
 * Public function resizeImages -- loads and resizes a series of images inside adirectory.
 * @param {string} inputDir - The path of the input directory
 * @param {string} outputDir - The path of the output directory
 * @param {Array} sizes - Array of sizes
 */

const resizeImages = (inputDir, outputDir, sizes) => {
  if (!Array.isArray(sizes)) {
    if (Number.isInteger(sizes)) {
      sizes = [sizes];
    } else {
      console.log('Wrong size format.');
      return;
    }
  }
  if (!fs.existsSync(outputDir)) {
    console.log(`${outputDir}: Directory does not exist.`);
    return;
  }
  getDirContents(inputDir)
    .then(files => {
      files.forEach( filename => {
        sizes.forEach( size => {
          const parts = filename.split('.');
          const inputPath = inputDir + filename;
          const outputPath = outputDir + parts[0] + '-' + size.toString() + '.' + parts[parts.length - 1];
          resizeSingleImage(inputPath, outputPath, size)
            .then(res => {
              console.log(`${inputPath} resized to ${outputPath}`);
            })
            .catch(err => {
              console.log(`${inputPath}: ${err}`);
            })
        });
      });
    })
    .catch(err => {
      console.log(err);
    })
}

exports.resizeImages = resizeImages;