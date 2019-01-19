/** 
 * Module imageResize - Resizes a series of images.
 * @module imageResize
*/

const sharp = require('sharp');
const ora = require('ora');

const spinner = new ora('Initializing...').start();

// uses the sharp library to load, resize and then save a single image

const resizeSingleImage = (input, size, output) => {
  // returns a promise
  return sharp(input)
    .resize(size)
    .toFile(output);
}

/**
 * Public function imageResize -- loads and resizes a single image.
 * @param {string} filename 
 * @param {int} size 
 */

const imageResize = (filename, size) => {
  if (!Number.isInteger(size)) {
    spinner.fail('Size must be a number.');
    return;
  }
  resizeSingleImage(filename, size, 'img/image1-resized.jpg')
    .then(res => {
      spinner.succeed(`${filename} resized.`);
    })
    .catch(error => {
      spinner.fail(`${filename}: ${error}`);
    })
}

exports.resize = imageResize;