//
// https://docs.aws.amazon.com/fr_fr/sdk-for-javascript/v2/developer-guide/s3-example-creating-buckets.html
//


var _ = require('lodash');


var AWS = require('aws-sdk');
// https://docs.aws.amazon.com/fr_fr/sdk-for-javascript/v2/developer-guide/loading-node-credentials-environment.html
// https://docs.aws.amazon.com/fr_fr/sdk-for-javascript/v2/developer-guide/loading-node-credentials-json-file.html
if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    AWS.config.loadFromPath('./credentials/aws-s3.json');
}


module.exports = class S3 {

    constructor(bucket) {
        this.bucket = bucket;
        this.s3 = new AWS.S3({apiVersion: '2006-03-01'});
        // AWS.config.update({region: 'us-west-2'});
    }

    listBuckets() {
        this.s3.listBuckets(function (err, data) {
            if (err) {
                console.error("(AWS-S3) [ERROR] listBuckets:", err);
            } else {
                console.log("(AWS-S3) listBuckets:", data.Buckets);
            }
        });
    }


    listResources() {
        this.s3.listObjects({Bucket: this.bucket}, function (err, data) {
            if (err) {
                console.error("(AWS-S3) [ERROR] listResources:", err);
            } else {
                console.log("(AWS-S3) listResources", data);
            }
        });
    }

    // Key: 'trackings/slack-inagua/timy-jco-181003.json'
    loadJSON(key, successCB, errorCB) {
        this.s3.getObject({Bucket: this.bucket, Key: key}, function (err, data) {
            if (err) {
                console.error('(AWS-S3) [ERROR] loadJSON: key:', key, ' error:', err);
                if (errorCB) {
                    errorCB(err);
                } else {
                    successCB();
                }
            } else {
                // console.log("Raw text:\n" + data.Body.toString('ascii'));
                // callback(null, null);
                const json = JSON.parse(data.Body.toString('ascii'));
                successCB(json);
            }
        });
    }

    saveJSON(json, key, successCB, errorCB) {
        this.s3.putObject({
            Bucket: this.bucket,
            Key: key,
            Body: JSON.stringify(json),
            ContentType: "application/json"
        }, function (err, data) {
            if (err) {
                console.error("(AWS-S3) [ERROR] saveJSON:", err);
                if (errorCB) { errorCB(err); }
            } else {
                console.log("(AWS-S3) saveJSON", data);
                if (successCB) { successCB(); }
            }
        });
    }

    bucketForTeamAndUser(team, user) {
        return `trackings/slack/${team}/${user}.json`;
    }

};
