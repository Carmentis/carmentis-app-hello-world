import express from 'express'
const app = express()
import cors from 'cors';
import bodyParser from 'body-parser';
import * as sdk from "./carmentis-application-sdk.js";
import * as config     from "./config.mjs";

const port = config.APPLICATION_PORT

class Message {
    constructor(sender, date, message) {
        this.sender = sender;
        this.date = date;
        this.message = message;
    }
}

let messages = [
    new Message("gael.marcadet@carmentis.io", "21/01/2024", "This message is hardcoded.")
]


/*
 * TODO
 */
let messageWaitingForApproval = {}

sdk.initialize({
    host: config.CARMENTIS_OPERATOR_HOST,
    port: config.CARMENTIS_OPERATOR_PORT,
});

const OPERATOR_URL = `${config.CARMENTIS_OPERATOR_HOST}:${config.CARMENTIS_OPERATOR_PORT}`;

// Define the CORS options
const corsOptions = {
    origin: ['https://' + config.CARMENTIS_OPERATOR_HOST],
};
console.info("CORS Allowed origins:", corsOptions.origin)
app.use(cors(corsOptions));
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }));

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

    // check if all fields pressent
    if (!sender || !message) {
        res.redirect("/")
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
                message: "receptionMessage"
            }
        }

        console.log(data);
    let answer = await sdk.query( // premier appel vers operat
        "prepareUserApproval",
        data
    );

    if (!answer.success) {
        res.send(JSON.stringify(answer));
        return;
    }

    console.log("prepareUserApproval", answer);
    // TODO: ensure that the anwser contains an identifier and a record identifier
    let data_response = answer["data"]
    let id = data_response["id"]
    let recordId = data_response["recordId"]

    // store the message even if it is not approved yet
    messageWaitingForApproval[id] = new Message(sender, date, message);


    res.redirect(`/approval?id=${id}&recordId=${recordId}`);
})

app.get("/approval", (req, res) => {
    let params = req.query
    res.render("approval", {
        id: params["id"],
        recordId: params["recordId"],
        operator_url: OPERATOR_URL,
    })
})

app.get("/success", (req, res) => {
    let params = req.query
    let transaction_id = params["transaction-id"]
    if (transaction_id && messageWaitingForApproval[transaction_id]) {
        let message = messageWaitingForApproval[transaction_id];
        delete messageWaitingForApproval[transaction_id]
        messages.push(message)
    }
    res.render("success", {
        operator_url: OPERATOR_URL,
    })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
