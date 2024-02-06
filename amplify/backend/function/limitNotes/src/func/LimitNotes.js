const fetch = require('node-fetch');
const GRAPHQL_ENDPOINT = process.env.API_AMPLIFYAPP_GRAPHQLAPIENDPOINTOUTPUT;
const GRAPHQL_API_KEY = process.env.API_AMPLIFYAPP_GRAPHQLAPIKEYOUTPUT;
const query = /* GraphQL */ `
    query LIST_NOTES {
        listNotes {
            items {
                id
                name
                description
            }
        }
    }
`;
const limitNote = async () => {
    const fetch = require("node-fetch");
    const options = {
        method: 'POST',
        headers: {
            'x-api-key': GRAPHQL_API_KEY,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
    };
    let body;
    let response;
    let statusCode;
    try {
        response = await fetch(GRAPHQL_ENDPOINT, options);
        body = await response.json();
        if (body.errors) statusCode = 400;
    } catch (error) {
        statusCode = 400;
        body = {
            errors: [
                {
                    status: response.status,
                    message: error.message,
                    stack: error.stack
                }
            ]
        };
    }
    return {
        statusCode,
        body
    }
}
module.exports = {
    limitNote
};