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

/**
 * Public function resizeSingleImage -- loads and resizes a single image.
 * @param {string} input - The path of the input file
 * @param {string} output - The path of the output file 
 * @param {int} size - Array of sizes
 */

const resizeSingleImage = (input, output, size) => {
  if (!Number.isInteger(size)) {
    spinner.fail('Size is missing or not a number');
    return;
  }
  // returns a promise
  return sharp(input)
    .resize(size)
    .toFile(output)
    .then(res => {
      spinner.succeed(`${input} resized.`);
    })
    .catch(err => {
      spinner.fail(`${output}: ${err}`);
    })
}

/**
 * Public function resizeImages -- loads and resizes a series of images inside adirectory.
 * @param {string} inputDir - The path of the input directory
 * @param {string} outputDir - The path of the output directory
 * @param {Array} sizes - Array of sizes
 */

const resizeImages = (inputDir, outputDir, sizes) => {
  getDirContents(inputDir)
    .then(files => {
      files.forEach(file => {
        spinner.info(file);
      });
    })
    .catch(err => {
      spinner.fail(err);
    })
}

exports.resizeImage = resizeSingleImage;
exports.resizeImages = resizeImages;