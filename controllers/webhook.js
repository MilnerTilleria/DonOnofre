const md5 = require('md5');
const crypto = require('crypto');
const { request, response } = require('express');

let wss;


const webhookPost = async (req = request, res = response) => {
    const secret = process.env.API_SECRECT; // clave secreta para firmar el webhook
    const receivedHash = req.headers['x-adams-notify-hash'];

    const postData = JSON.stringify(req.body);


    const { debt: { payStatus } = {} } = req.body; // Desestructuración de payStatus

    const payStatusStatus = payStatus?.status; // Extraer el status de payStatus

    if (payStatusStatus === 'paid') {
        console.log('El pago ha sido realizado:', payStatus);
        // Aquí puedes agregar la lógica adicional para procesar el pago
        //TODO AGREGAR WEB SOCKET
        notifyClientPaymentSuccess();
    } else {
        console.log('El pago no ha sido realizado o el estado es diferente.');
        // Opcionalmente, puedes enviar una respuesta o realizar alguna acción
    }

   




    // Procesar el webhook
    res.status(200).json({ message: 'Webhook recibido correctamente' });
};

// Esta función ahora usará la instancia de wss para enviar el mensaje
// Cambia esto en el archivo webhook.js
function notifyClientPaymentSuccess() {
    if (wss) {
        wss.clients.forEach(client => {
            if (client.readyState === 1) { // WebSocket.OPEN === 1
                client.send(JSON.stringify({ message: 'paid' }));
            }
        });
    }
}


// Exporta la función para que se pueda configurar
function setWebSocketInstance(wsServer) {
    wss = wsServer; // Guardar la instancia del WebSocket
}

module.exports = {
    webhookPost,
    setWebSocketInstance 
};