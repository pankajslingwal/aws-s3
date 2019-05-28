const fs = require('fs');
const S3 = require('aws-sdk/clients/s3');

module.exports = function (config) {
    //TODO: check for region also -- suddenly when region specified started giving error
    config.apiVersion = '2006-03-01';
    this.s3 = new S3(config);

    this.deleteFile = (appName, key) => {
        return new Promise(function (resolve, reject) {
            try {
                var params = { Bucket: appName, Key: key };
                s3.deleteObject(params, function (err, data) {
                    if (err) {
                        console.error("Error deleting the file with key : " + key, err);
                        reject({ status: 0 });
                    } else {
                        console.log("Successfully deleted a file with key : " + key);
                        resolve({ status: 1 });
                    }
                });
            } catch (ex) {
                reject({ status: 0 });
            }
        });
    }

    this.uploadFile = (appName, folderName, files, fileName, fileType) => {
        return new Promise(function (resolve, reject) {
            try {
                var headObjParams = { Bucket: appName, Key: folderName };

                s3.headObject(headObjParams, function (err, data) {
                    if (err && err.code === 'NotFound') {
                        var params = { Bucket: appName, Key: folderName, ACL: 'public-read', Body: 'body does not matter' };
                        s3.upload(params, function (err, data) {
                            if (err) {
                                //what happends here ?
                                //Below file will will be still uploaded with folder appended in KEY but folder will not be 
                                //Created in s3...that should still be ok
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
                            reject({ status: 0 });
                        } else {
                            console.log('Successfully uploaded File with key : ' + folderName + fileName + '.' + fileType);
                            resolve({ status: 1, fileName });
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
            } catch (ex) {
                reject({ status: 0 });
            }
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
