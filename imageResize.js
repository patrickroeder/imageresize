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
      return reject(`${dir}: Directory does not exist`);
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
      console.log('Wrong size format or wrong parameter count');
      return;
    }
  }
  if (!fs.existsSync(outputDir)) {
    console.log(`${outputDir}: Directory does not exist`);
    return;
  }

  getDirContents(inputDir)
    // we've now got our array of files in the directory
    .then(files => {
      let promises = [];
      files.forEach( filename => {
        sizes.forEach( size => {
          const parts = filename.split('.');
          const inputPath = inputDir + filename;
          const outputPath = outputDir + parts[0] + '-' + size.toString() + '.' + parts[parts.length - 1];
          // calls sharp which returns a promise and loads, resizes and saves a single image
          promises.push(sharp(inputPath).resize(size).toFile(outputPath));
        });
      });
      // The Promise.all method returns a promise when all the promises inside the promises array are resolved
      return Promise.all(promises);
    })
    // chaining the thenables instead of nesting
    .then(res => {
      console.log(`All images in directory ${inputDir} resized to ${sizes} and copied to ${outputDir}`);
    })
    .catch(err => {
      console.log(err);
    })
}

exports.resizeImages = resizeImages;