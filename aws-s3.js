const fs = require('fs');
const S3 = require('aws-sdk/clients/s3');

module.exports = function (config) {
    this.s3 = new S3(config);

    this.deleteFile = (appName, key) => {
        return new Promise(function (resolve, reject) {
            var params = { Bucket: appName, Key: key };
            s3.deleteObject(params, function (err, data) {
                if (err) {
                    console.error("Error deleting the file with key : " + key, err);
                    reject('{status:0}');
                } else {
                    console.log("Successfully deleted a file with key : " + key);
                    resolve('{status:1}');
                }
            });
        });
    }

    this.uploadFile = (appName, folderName, files, fileName, fileType) => {
        return new Promise(function (resolve, reject) {
            var headObjParams = { Bucket: appName, Key: folderName };

            s3.headObject(headObjParams, function (err, data) {
                if (err && err.code === 'NotFound') {
                    var params = { Bucket: bucketName, Key: folderName, ACL: 'public-read', Body: 'body does not matter' };
                    s3.upload(params, function (err, data) {
                        if (err) {
                            console.error("Error creating Folder with key : " + folderName, err);
                        } else {
                            console.log("Successfully created Folder with key : " + folderName);
                        }
                    });
                } else {
                    console.log('Folder already exist with key : ' + folderName);
                }
            });

            fs.readFile(files.myfile.path, function (err, data) {
                if (err) throw err;

                const params = {
                    Bucket: appName,
                    Key: folderName + fileName + '.' + fileType,
                    ContentType: fileType,
                    ACL: 'public-read',
                    Body: data
                };
                s3.upload(params, (err, data) => {
                    if (err) {
                        console.error("Error uploading File with key : " + folderName + fileName + '.' + fileType, err);
                        reject('{status:0}');
                    } else {
                        console.log('Successfully uploaded File with key : ' + folderName + fileName + '.' + fileType);
                        resolve('{status:1}');
                    }
                });

                fs.unlink(files.myfile.path, function (err) {
                    if (err) {
                        console.error("Error deleting temp folder", err);
                    } else {
                        console.log('Temp File Delete');
                    }
                });
            });
        })
    }

    return this;
};


//Code for signedRequest 
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
