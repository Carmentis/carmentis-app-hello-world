window.addEventListener("load",  function () {
    // load the wallet detector element
    let walletDetector = document.getElementById('wallet');
    walletDetector.className += window.carmentisWallet === undefined ? " missing" : " found"


    // load the wallet detector element
    let operatorDetector = document.getElementById('operator');
    let operatorLabel = document.getElementById('operatorLabel');
    let operatorURL = document.getElementById('operatorURL').textContent;
    var xmlHttp = new XMLHttpRequest();
    try {
        xmlHttp.open("GET", operatorURL, false);
        xmlHttp.send(null);
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
            operatorDetector.className += " found"
            operatorLabel.textContent += ` (${operatorURL})`
        } else {
            operatorDetector.className += " missing"
            operatorLabel.textContent += ` (code:${xmlHttp.status})`
        }
    } catch (err) {
        operatorDetector.className += " missing"
        operatorLabel.textContent += ` (${err})`
    }
})