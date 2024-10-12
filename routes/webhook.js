const { Router } = require('express');
const { webhookPost, setWebSocketInstance } = require('../controllers/webhook');

const router = Router();

// Manejar la ruta POST para el webhook
router.post('/', webhookPost);

// Exportar el router y la función para establecer la instancia de WebSocket
module.exports = {
    router,
    setWebSocketInstance // Cambiado de setWebSocket a setWebSocketInstance para ser consistente
};