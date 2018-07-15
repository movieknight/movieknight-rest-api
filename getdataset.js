var http = require('http');
var fs = require('fs');
var AdmZip = require('adm-zip');

console.log("Downloading dataset ml-20m.zip");

//console.log("When download finished please do unzip ml-20m.zip");
var url = "http://files.grouplens.org/datasets/movielens/ml-20m.zip";
var download = function(url) {
    var tmpFilePath = "./ml-20m.zip";
		http.get(url, function(response) {
		    response.on('data', function (data) {
		 		    fs.appendFileSync(tmpFilePath, data);
				});
		 		response.on('end', function() {
		 			  var zip = new AdmZip(tmpFilePath)
		 			  zip.extractAllTo("./");
		 			  fs.unlink(tmpFilePath)
			 	})
	  });
}

download(url);
console.log("When finished, check your current directory for ml-20m");
