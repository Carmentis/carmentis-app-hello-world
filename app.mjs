/*
 * Copyright (c) Carmentis. All rights reserved.
 * Licensed under the Apache 2.0 licence.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import express from 'express'
const app = express()
import cors from 'cors';
import bodyParser from 'body-parser';
import * as sdk from "./carmentis-application-sdk.js";
import * as config     from "./config.mjs";


// halt if the environment does not contain the sufficient variables to run the application properly
if (!config.CARMENTIS_OPERATOR_HOST) { throw "Undefined operator host!"}
if (!config.CARMENTIS_OPERATOR_PORT) { throw "Undefined operator port!"}
if (!config.APPLICATION_PORT) { throw "Undefined application port!"}
if (!config.CARMENTIS_APPLICATION_ID) { throw "Undefined application id!"}
if (!config.CARMENTIS_APPLICATION_VERSION) { throw "Undefined application version!"}


class Message {
    constructor(sender, date, message) {
        this.sender = sender;
        this.date = date;
        this.message = message;
    }
}

let messages = [
    new Message("gael.marcadet@carmentis.io", "21/01/2024", "This message is hardcoded."),
    new Message("gael.marcadet@carmentis.io", "21/01/2024", "This message is also hardcoded.")
]


/*
 * This map contains the list of messages being sent by users but not yet approved by other users.
 */
let messageWaitingForApproval = {}


// Define the operator URL (domain:port) and initialize the SDK
const OPERATOR_URL = `${config.CARMENTIS_OPERATOR_HOST}:${config.CARMENTIS_OPERATOR_PORT}`;
sdk.initialize({
    host: config.CARMENTIS_OPERATOR_HOST,
    port: config.CARMENTIS_OPERATOR_PORT,
});


// configure the dependencies (express, body-parser to recover parameters, CORS)
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(cors({
    origin: [config.CARMENTIS_OPERATOR_HOST],
}));


// configure pug
app.set('views', './views')
app.set("view engine", "pug")


app.get('/', (req, res) => {
    res.render('index', {
        operator_url: OPERATOR_URL,
        messages: messages
    });
})

app.post("/submitMessage", async (req, res) => {
    let sender = req.body.sender;
    let message = req.body.message;
    let now = new Date();
    let date = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;

    // check if all fields present
    if (!sender) {
        console.debug("[DBG] Missing 'sender' field in the request")
        res.status(401).send(JSON.stringify({"error": "missing 'sender' field in the request."}));
        return;
    }

    if (!message) {
        console.debug("[DBG] Missing 'message' field in the request")
        res.status(401).send(JSON.stringify({"error": "missing 'message' field in the request."}));
        return;
    }

    // The fields declared in the workspace page (https://data.testapps.carmentis.io/workspace) are used below.
    let field = {
        Sender: sender,
        Date: date,
        Message: message
    };

    let data =
        {
            application: config.CARMENTIS_APPLICATION_ID,
            version: config.CARMENTIS_APPLICATION_VERSION,
            fields: field,
            actors: [
                {
                    name: "sender",
                    authentication: {
                        method: "email",
                        value : "x"
                    }
                },
            ],
            channels: [
                "mainChannel",
            ],
            subscriptions: {
                sender: [
                    "mainChannel",
                ],
            },
            permissions: {
                mainChannel: ["*"],
            },
            approval: {
                actor: "sender",
                message: "approvalMessage"
            }
        }

    let answer = await sdk.query(
        "prepareUserApproval",
        data
    );

    if (!answer.success) {
        console.error("PrepareUserApproval: Query failure: ", answer)
        res.send(JSON.stringify(answer));
        return;
    }


    let data_response = answer["data"]
    let id = data_response["id"]
    let recordId = data_response["recordId"]

    // store the message even if it is not approved yet
    messageWaitingForApproval[id] = new Message(sender, date, message);

    // respond with the id used later to obtain the record.
    res.send(JSON.stringify({
        id: id,
        recordId: recordId,
    }));
})


app.get("/success", (req, res) => {
    let params = req.query
    let transaction_id = params["id"]
    if (transaction_id && messageWaitingForApproval[transaction_id]) {
        let message = messageWaitingForApproval[transaction_id];
        delete messageWaitingForApproval[transaction_id]
        messages.push(message)
    }
    res.redirect("/")
})

// launch node
const port = config.APPLICATION_PORT
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
