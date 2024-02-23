const fetch = require('node-fetch');
const GRAPHQL_ENDPOINT = process.env.API_AMPLIFYAPP_GRAPHQLAPIENDPOINTOUTPUT;
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
const limitNote = async (token) => {
    const fetch = require("node-fetch");
    const options = {
        method: 'POST',
        headers: {
            'authorization': token,
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