const imageresize = require('./imageResize');

imageresize.resizeImage('img/original/image1.jpg','img/edited/image1-300.jpg', 300);
imageresize.resizeImages('img/original/','img/edited/', [200,300,400]);