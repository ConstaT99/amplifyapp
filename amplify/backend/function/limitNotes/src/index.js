/* Amplify Params - DO NOT EDIT
	API_AMPLIFYAPP_GRAPHQLAPIENDPOINTOUTPUT
	API_AMPLIFYAPP_GRAPHQLAPIIDOUTPUT
	API_AMPLIFYAPP_GRAPHQLAPIKEYOUTPUT
	API_AMPLIFYAPP_NOTETABLE_ARN
	API_AMPLIFYAPP_NOTETABLE_NAME
	API_AMPLIFYAPP_USERINFOTABLE_ARN
	API_AMPLIFYAPP_USERINFOTABLE_NAME
	AUTH_AMPLIFYAPPE752F39B_USERPOOLID
	ENV
	REGION
	STORAGE_MYNOTE_BUCKETNAME
Amplify Params - DO NOT EDIT */// /* Amplify Params - DO NOT EDIT
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
const graphqlfetch = require( "./func/graphqlfetch");
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
            owner
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
    let event_dict = JSON.parse(event);
    console.log(event_dict.token)
    let res = await LimitNotes.limitNote(event_dict.token);
    statusCode = res.statusCode;
    body = res.body;
    console.log(JSON.stringify(event));


    const limit = 3;
    console.log(JSON.stringify(body));
    const totalNotes = body.data.listNotes.items;
    let variables = {
        input: {
            name: event_dict.name,
            description: event_dict.description,
            image : event_dict.image,
            owner : event_dict.owner
        }
    };
    console.log(variables.input.name)
    if(Object.keys(totalNotes).length >= limit){
        variables = {
            input: {
                name : "please add credits",
                description : "please add credits",
                image: "",
                owner : event_dict.owner
            }
        }
    }

    const options = {
        method: 'POST',
        headers: {
            'authorization': event_dict.token,
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
