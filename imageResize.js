/** 
 * Module imageResize - Resizes a series of images.
 * @module imageResize
*/

const fs = require('fs');
const sharp = require('sharp');
const ora = require('ora');

const spinner = new ora().start();

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

const resizeSingleImage = (input, output, size) => {
  if (!Number.isInteger(size)) {
    spinner.fail('Size is missing or not a number');
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
    spinner.fail (`${inputDir}: Wrong size format.`);
    return;
  }
  if (!fs.existsSync(outputDir)) {
    spinner.fail (`${outputDir}: Directory does not exist.`);
    return;
  }
  getDirContents(inputDir)
    .then(files => {
      files.forEach( filename => {
        sizes.forEach( size => {
          const parts = filename.split('.');
          const inputPath = inputDir + filename;
          const outputPath = outputDir + parts[0] + '-' + size.toString() + '.' + parts[parts.length - 1];
          resizeSingleImage(inputPath, outputPath, size);
          spinner.succeed(`${inputPath} resized to ${outputPath}`);
        });
      });
    })
    .catch(err => {
      spinner.fail(err);
    })
}

exports.resizeImages = resizeImages;