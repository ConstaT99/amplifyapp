const AWS = require('aws-sdk');

const graphqlFetch= async () => {
    const docClient = new AWS.DynamoDB.DocumentClient();
    let params = {
        TableName: "Note",
        Key: { KEY_NAME: "Owner" },
    };
    docClient.get(params, function (err, data) {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("Success", data.Item);
        }
    });
}

module.exports = {
    graphqlFetch
};