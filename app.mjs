import express from 'express'
const app = express()
const port = 3000
import bodyParser from 'body-parser';
import * as sdk from "./applicationSdk.mjs";
import * as config     from "./config.mjs";



sdk.initialize({
    host: config.OPERATOR_HOST,
    port: config.OPERATOR_PORT
});


app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', './views')
app.set("view engine", "pug")

app.get('/', (req, res) => {
    res.render('index', { title: 'Hey', message: 'Hello there!'});
})

app.get("/success", (req, res) => {
    res.render("success")
})

app.post("/submitMessage", async (req, res) => {
    let sender = req.body.sender;
    let message = req.body.message;

    // check if all fields pressent
    if (!sender || !message) {
        res.redirect("/")
        return;
    }

    let field = {
        Sender: sender,
        Date: "12/09/2024",
        Message: {
            Content: message,
        }
    };

    let data =
        {
            application: config.FA_APPLICATION_ID,
            version: config.FA_APPLICATION_VERSION,
            fields: field,
            actors: [
                {
                    name: "sender",
                    authentication: {
                        method: "email",
                        value : "x"
                    }
                },
                {
                    name: "recipient",
                    authentication: {
                        method: "email",
                        value : "x"
                    }
                }
            ],
            channels: [
                "mainChannel",
            ],
            subscriptions: {
                sender: [
                    "mainChannel",
                ],
                recipient: [
                    "mainChannel",
                ]
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

    res.redirect("/success")
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
