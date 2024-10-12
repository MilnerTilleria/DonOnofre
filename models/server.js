const express = require('express');
var cors = require('cors');
const http = require('http'); // Importar el módulo http
const WebSocket = require('ws');
const { dbConnection } = require('../database/config');
const { router: webhookRouter, setWebSocketInstance } = require('../routes/webhook'); // Importar el router y la función

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.productosPath = '/api/productos';
        this.deudasPath = '/api/pay';
        this.webHookPath = '/api/webhook';
        this.conectarDB();

        this.middlewares();
        this.routes();

        // Crear un servidor HTTP
        this.server = http.createServer(this.app);
        // Crear un servidor WebSocket
        this.wss = new WebSocket.Server({ server: this.server });
        
        // Configurar la instancia de WebSocket en las rutas
        setWebSocketInstance(this.wss); // Usar setWebSocketInstance directamente
        // Manejar conexiones WebSocket
        this.wss.on('connection', (ws) => {
            console.log('Cliente conectado');
            ws.on('message', (message) => {
                console.log(`Mensaje recibido: ${message}`);
            });
        });
    }

    async conectarDB() {
        await dbConnection();
    }

    middlewares() {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.static('public', {
            setHeaders: function (res, path) {
                res.setHeader('Cache-Control', 'no-store');
            }
        }));
        this.app.use(express.text());
    }

    routes() {
        this.app.use(this.productosPath, require('../routes/productos'));
        this.app.use(this.deudasPath, require('../routes/deudas'));
        this.app.use(this.webHookPath, webhookRouter); // Asegúrate de usar el router aquí
    }

    listen() {
        this.server.listen(this.port, () => { // Cambia this.app.listen a this.server.listen
            console.log(`Corriendo en el puerto ${this.port}`);
        });
    }
};

module.exports = Server;
