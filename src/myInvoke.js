// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { InvokeCommand, LambdaClient, LogType } from "@aws-sdk/client-lambda";
// import { Buffer } from 'buffer';


/** snippet-start:[javascript.v3.lambda.actions.Invoke] */
const invoke = async (funcName, payload , credentials) => {
    const client = new LambdaClient({
        region: "us-east-2",
        credentials:credentials.credentials
    });
    const command = new InvokeCommand({
        FunctionName: funcName,
        Payload: JSON.stringify(payload),
        LogType: LogType.Tail,
    });

    const { Payload, LogResult } = await client.send(command);
    const logs = atob(LogResult);
    console.log(logs)
    return Payload;
};
/** snippet-end:[javascript.v3.lambda.actions.Invoke] */

export { invoke };