var express = require('express');
var axios = require('axios');
var S3 = require('aws-sdk/clients/s3');
var formidable = require('formidable');
var fs = require('fs');

var uuidv4 = require('uuid/v4');

const app = express();

var bucketName = 'test-bucket-pankaj';

var folder = 'myFolder/';

// Configure aws with your accessKeyId and your secretAccessKey
const s3 = new S3({
    region: 'us-west-2', // Put your aws region here
    accessKeyId: 'sdsd',
    secretAccessKey: 'sdsdsddsdds'
});
// aws.config.update({
//     region: 'us-west-2', // Put your aws region here
//     accessKeyId: 'AKIAVKAXD6K5DJ3GDAWF',
//     secretAccessKey: 'S9rrzYnodznumKa+zSYjlwx+bsi1x9YfE1y1uo+6'
// })

//const s3 = new aws.S3();


app.post('/', function (req, res) {

    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        const file = files.myfile.name;

        let fileParts = file.split('.');
        const fileName = uuidv4();
        const fileType = fileParts[1];

        // Set up the payload of what we are sending to the S3 api
        var params = { Bucket: 'test-bucket-pankaj', Key: folder, ACL: 'public-read', Body: 'body does not matter' };

        s3.upload(params, function (err, data) {
            if (err) {
                console.log("Error creating the folder: ", err);
            } else {
                console.log("Successfully created a folder on S3");

            }
        });


        //Make a request to the S3 API to get a signed URL which we can use to upload our file
        fs.readFile(files.myfile.path, function (err, data) {
            if (err) throw err; // Something went wrong!

            // Set up the payload of what we are sending to the S3 api
            const s3Params = {
                Bucket: 'test-bucket-pankaj',
                Key: folder + fileName + '.' + fileType,
                Expires: 500,
                ContentType: fileType,
                ACL: 'public-read',
                Body: data
            };
            s3.upload(s3Params, (err, data) => {

            });


            // Whether there is an error or not, delete the temp file
            fs.unlink(files.myfile.path, function (err) {
                if (err) {
                    console.error(err);
                }
                console.log('Temp File Delete');
            });
        });


        // // Make a request to the S3 API to get a signed URL which we can use to upload our file
        // s3.getSignedUrl('putObject', s3Params, (err, data) => {

        //     if (err) {
        //         //console.log(err);
        //     }


        //     // Data payload of what we are sending back, the url of the signedRequest and a URL where we can access the content after its saved. 
        //     const returnData = {
        //         signedRequest: data,
        //         url: `https://test-bucket-pankaj.s3.amazonaws.com/${fileName}` + `.${fileType}`
        //     };

        //     // Send it all back
        //     var options = {
        //         headers: {
        //             'Content-Type': fileType
        //         }
        //     };

        //     fs.readFile(files.myfile.path, function (err, data) {
        //         if (err) throw err; // Something went wrong!
        //         axios.put(returnData.signedRequest, data, options)
        //             .then(result => {
        //                 console.log("Response from s3");
        //             })
        //             .catch(error => {
        //                 console.log("ERROR " + error);
        //             });

        //         // Whether there is an error or not, delete the temp file
        //         fs.unlink(files.myfile.path, function (err) {
        //             if (err) {
        //                 console.error(err);
        //             }
        //             console.log('Temp File Delete');
        //         });
        //     });
        // });

    });
});



app.listen(3000);
console.log("server started at localhost:3000");



