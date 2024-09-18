// TODO The organisation's id is no more significant and will be removed.
const ORGANIZATION_ID = "0000000000000000000000000000000000000000000000000000000000000000";


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
