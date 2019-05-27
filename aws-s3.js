const fs = require('fs');
const S3 = require('aws-sdk/clients/s3');

module.exports = function(config) {
    this.s3 = new S3(config);

    //To delete file based on key
    this.deleteFile = (appName, key) => {
        var headDeleteParams = { Bucket: appName, Key: key};
        s3.deleteObject(headDeleteParams, function (err, metadata) {
            if (err) {
                console.log("Error deleting the file: ", err);
            } else {
                console.log("Successfully eleted a file on S3");
            }
        });
    }

    //To upload multiple file including folder
    this.uploadFile = (appName, folder, files, fileName, fileType) => {
        var headParams = { Bucket: bucketName, Key: folder};

        s3.headObject(headParams, function (err, metadata) {
            if (err && err.code === 'NotFound') {
                var params = { Bucket: bucketName, Key: folder, ACL: 'public-read', Body: 'body does not matter' };
                s3.upload(params, function (err, data) {
                    if (err) {
                        console.log("Error creating the folder: ", err);
                    } else {
                        console.log("Successfully created a folder on S3");

                    }
                });
            } else {
                console.log('folder already created');
            }
        });
        
        fs.readFile(files.myfile.path, function (err, data) {
            if (err) throw err; // Something went wrong!

            const s3Params = {
                Bucket: bucketName,
                Key: folder + fileName + '.' + fileType,
                Expires: 500,
                ContentType: fileType,
                ACL: 'public-read',
                Body: data
            };
            s3.upload(s3Params, (err, data) => {
                if (err) {
                    console.log("Error uploading file: ", err);
                } else {
                    console.log('file uploaded !!');
                }
            });

            fs.unlink(files.myfile.path, function (err) {
                if (err) {
                    console.error(err);
                }
                console.log('Temp File Delete');
            });
        });
    }
    
    return this;
};


//COde for signedRequest 
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
