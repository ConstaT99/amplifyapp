// /* Amplify Params - DO NOT EDIT
// 	API_AMPLIFYAPP_GRAPHQLAPIENDPOINTOUTPUT
// 	API_AMPLIFYAPP_GRAPHQLAPIIDOUTPUT
// 	API_AMPLIFYAPP_GRAPHQLAPIKEYOUTPUT
// 	API_AMPLIFYAPP_NOTETABLE_ARN
// 	API_AMPLIFYAPP_NOTETABLE_NAME
// 	API_AMPLIFYAPP_USERINFOTABLE_ARN
// 	API_AMPLIFYAPP_USERINFOTABLE_NAME
// 	AUTH_AMPLIFYAPPE752F39B_USERPOOLID
// 	ENV
// 	REGION
// 	STORAGE_MYNOTE_BUCKETNAME
// Amplify Params - DO NOT EDIT */

const fetch = require('node-fetch');
const LimitNotes = require("./func/LimitNotes");
const GRAPHQL_ENDPOINT = process.env.API_AMPLIFYAPP_GRAPHQLAPIENDPOINTOUTPUT;
const GRAPHQL_API_KEY = process.env.API_AMPLIFYAPP_GRAPHQLAPIKEYOUTPUT;
const query = /* GraphQL */ `
    mutation CreateNote(
        $input: CreateNoteInput!
    ) {
        createNote(input: $input) {
            id
            name
            description
            image
            createdAt
            updatedAt
            __typename
        }
    }
`;

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    let statusCode = 200;
    let body = null;
    let res = await LimitNotes.limitNote();
    statusCode = res.statusCode;
    body = res.body;
    console.log(JSON.stringify(event))
    var event_dict = JSON.parse(event);

    const limit = 3;
    const totalNotes = body.data.listNotes.items;
    let variables = {
        input: {
            name: event_dict.name,
            description: event_dict.description,
            image : event_dict.image
        }
    };
    console.log(variables.input.name)
    if(Object.keys(totalNotes).length >= limit){
        variables = {
            input: {
                name : "please add credits",
                description : "please add credits",
                image: ""
            }
        }
    }

    const options = {
        method: 'POST',
        headers: {
            'x-api-key': GRAPHQL_API_KEY,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query, variables })
    };
    console.log(variables.input.name)
    let response;
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
        body: JSON.stringify(body)
    };
};
