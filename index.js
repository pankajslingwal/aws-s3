//const axios = require('axios');
const express = require('express');
const S3 = require('./aws-s3');

const formidable = require('formidable');
const uuidv4 = require('uuid/v4');
const app = express();

//what about when session is expired
//Think of these scenario's

const s3 = S3({
    accessKeyId: 'adad',
    secretAccessKey: 'asdad'
});

app.delete('/delete/:folder/:key', function (req, res) {
    s3.deleteFile('test-bucket-pankaj', req.params.folder + '/' + req.params.key).then(function(val) {
        res.send(val);
     });
});

app.post('/', function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        const file = files.myfile.name;

        let fileParts = file.split('.');
        const fileName = uuidv4();
        const fileType = fileParts[1];

        s3.uploadFile('test-bucket-pankaj', 'myFolder/', files, fileName, fileType).then(function(val) {
            res.send(val);
         });
    });
});

app.listen(3000);
console.log("Server started at localhost:3000");