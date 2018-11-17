const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const request = require('request');
const sprintf = require('sprintf-js').sprintf;
const path = require('path');

/* ==============================>>>>>>>>>> Constraints <<<<<<<<<<============================== */

const numberOfImages = 500;
const timeoutInterval = 2000;
const urlOptions = {
  baseURL: 'https://loremflickr.com',
  width: '320',
  height: '220',
  topic: 'dish',
};
const url = `${urlOptions.baseURL}/${urlOptions.width}/${urlOptions.height}/${urlOptions.topic}`;
const imageDirectory = path.join(__dirname, './data/images');

/* ==============================>>>>>>>>>> Constraints <<<<<<<<<<============================== */

let imageIndex = 0;

let timeout = 0;

const streamingFunction = (imageName, imagePath) => {
  setTimeout(() => {
    const stream = request(url).pipe(fs.createWriteStream(imagePath));
    stream.on('finish', (error) => {
      if (error) {
        console.log(error);
      } else {
        console.log(`Image ${imageIndex} written to ./data/images/${imageName}`);
      }
    });
  }, timeout);
};

const getImagesAndCreateFiles = () => {
  while (imageIndex < numberOfImages) {
    const imageName = sprintf('%04s.jpg', imageIndex);
    const imagePath = path.join(imageDirectory, imageName);
    streamingFunction(timeout, imageName, imagePath);
    timeout += timeoutInterval;
    imageIndex += 1;
  }
};

getImagesAndCreateFiles();
