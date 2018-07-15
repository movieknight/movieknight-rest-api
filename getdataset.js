var http = require('http');
var fs = require('fs');

console.log("Downloading dataset ml-20m.zip");
var file = fs.createWriteStream("ml-20m.zip");
var request = http.get("http://files.grouplens.org/datasets/movielens/ml-20m.zip", function(response) {
  response.pipe(file);
});
console.log("When download finished please do unzip ml-20m.zip");
