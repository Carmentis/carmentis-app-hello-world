// TODO The organisation's id is no more significant and will be removed.
const ORGANIZATION_ID = "0000000000000000000000000000000000000000000000000000000000000000";

async function startApproval() {
    // load the data from the fields
    const sender = document.getElementById("sender").value;
    const message = document.getElementById("message").value;

    // load the URL of the operator
    // TODO Get the URL of operator using a request instead of looking at the web page
    let operatorURL = document.getElementById("operatorURL").value;
    if (!operatorURL) {
        operatorURL = "testapps.carmentis.io"
    }

    // send the approval request to the application
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/submitMessage", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.onreadystatechange = async function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            let response = JSON.parse(xhr.response);
            console.log(`[DBG] Response from application after sending of data: ${response}`);
            console.log(`[DBG] Response: `, response);
            // stop if the response corresponds to a failure
            if (response.error) {
                throw `Response from /submitMessage indicates a failure: ${response.error}`;
                return
            }

            let id = response.id;
            if (!id || !id.includes("-")) {
                console.error("[DBG] Invalid id returned by the /submitMessage: got", id);
            }
            await Carmentis.web.openApprovalPopup({
                id: id,
                operatorURL: "https://" + operatorURL,
                onSuccessCallback: () => {
                    document.location = `/success?id=${id}`
                }
            })
        }
    }
    xhr.send(JSON.stringify({
        sender: sender,
        message: message,
    }))
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("Start load message-approval")
    let submitButton = document.getElementById("submit");
    submitButton.addEventListener("click", startApproval)
})

/*
window.onload = async function() {
    // TODO verifier le nom de la transaction.
    let id = document.getElementById("transaction-id").textContent;
    console.log(`Asking approval for id: ${id}`)

    let answer = await Carmentis.wallet.request({
        qrElementId   : "qr", // QRCode identifier
        type          : "eventApproval",
        organizationId: ORGANIZATION_ID,
        data: {
            id: id
        },
        allowReconnection: true
    });

    if(answer.success) {
        window.location = `/success?transaction-id=${id}`
    }
}
*/