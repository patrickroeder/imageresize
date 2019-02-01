/** 
 * Module imageResize - Resizes a series of images.
 * @module imageResize
*/

const fs = require('fs');
const glob = require('glob');
const sharp = require('sharp');
const ora = require('ora');

/**
 * private helper function getDirContents - asynchronously and recursively get the contents of a directory and returns a list of file paths. Returns a Promise
 * @param {string} dir 
 */
const getDirContents = (dir) => {
  return new Promise((resolve, reject) => {
    // check if directory exists
    if (!fs.existsSync(dir)) {
      return reject(`${dir}: Directory does not exist`);
    }
    // recursively walks through tree of directory
    glob(dir + '/**/*{jpg,jpeg,png,gif,webp}', { nodir: true }, (err, fullpaths) => {
      if(err) {
        reject(err);
      } else {
        // remove dir part before returning
        const partial = fullpaths.map( path => {
          return path.replace(dir,'');
        });
        resolve(partial);
      }
    })
  })
}

const removeFilename = filepath => {
  const parts = filepath.split('/');
  // remove filename part
  parts.pop();
  return parts;
}

const containsDirectory = filepath => {
  const dirArray = removeFilename(filepath);
  if (dirArray.length > 0) {
    return true;
  } else {
    return false;
  }
}

const createDir = (filepath, outputDir) => {
  const dirArray = removeFilename(filepath);
  let dirPath = [];
  // iterate over each directory in path. index sequence important!
  for (let dir of dirArray) {
    dirPath.push(dir);
    // check if directory exists
    if (!fs.existsSync(outputDir + dirPath.join('/'))) {
      // go ahead and create directory
      fs.mkdirSync(outputDir + dirPath.join('/'));
    }
  }
}

/**
 * Public function resizeImages -- loads and resizes a series of images inside adirectory.
 * @param {string} inputDir - The path of the input directory
 * @param {string} outputDir - The path of the output directory
 * @param {Array} sizes - Array of sizes
 */

const resizeImages = (inputDir, outputDir, sizes) => {

  const spinner = ora('Resizing images...').start();

  if (!Array.isArray(sizes)) {
    if (Number.isInteger(sizes)) {
      sizes = [sizes];
    } else {
      spinner.fail('Wrong size format or wrong parameter count');
      return;
    }
  }
  if (!fs.existsSync(outputDir)) {
    spinner.fail(`${outputDir}: Directory does not exist`);
    return;
  }

  getDirContents(inputDir)
    // we've now got our array of files in the directory
    .then(files => {
      let promises = [];
      files.forEach( filepath => {
        sizes.forEach( size => {

          if (containsDirectory(filepath)) {
            createDir(filepath, outputDir);
          }

          // construct the complete input path for processing     
          const inputPath = inputDir + filepath;
          // construct the complete output path for processing 
          const parts = filepath.split('.');
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
      spinner.succeed(`All images in directory ${inputDir} resized to ${sizes} and copied to ${outputDir}`);
    })
    .catch(err => {
      spinner.fail(err);
    })
}

exports.resizeImages = resizeImages;