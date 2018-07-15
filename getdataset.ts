import * as http from 'http';
import * as fs from 'fs';
import * as AdmZip from 'adm-zip';

console.log('Downloading dataset ml-20m.zip');

//console.log("When download finished please do unzip ml-20m.zip");
const url = 'http://files.grouplens.org/datasets/movielens/ml-20m.zip';
const download = url => {
    const tmpFilePath = './ml-20m.zip';
    http.get(url, response => {
        response.on('data', data => {
            fs.appendFileSync(tmpFilePath, data);
        });
        response.on('end', () => {
            const zip = new AdmZip(tmpFilePath);
            zip.extractAllTo('./');
            fs.unlinkSync(tmpFilePath);
        })
    });
};

if (require.main === module) {
    download(url);
    console.info('When finished, check your current directory for ml-20m');
}
