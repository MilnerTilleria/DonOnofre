const { response, request } = require('express')
const axios = require('axios');
const crypto = require('crypto');
const Deuda = require('../models/deuda');
const moment = require('moment');
const { v4 : uuidv4 } = require('uuid');



const deudasGet = (req = request, res = response) => {
    const { q, nombre = 'No name', apikey, page = 1, limit } = req.query; 
    res.json({

        msg: 'Get API - controlador - productosGet',
        q,
        nombre,
        apikey,
        page,
        limit

    });
}

const deudasPost = async (req, res = response) => {
    const { docId, value, label } = req.body;
    try {
        
        const nuevaDeuda = new Deuda({
            debt: {
                docId: uuidv4(), 
                amount: {
                    currency: "PYG", 
                    value: value 
                },
                label: label, 
                validPeriod: {
                    start: moment.utc().toDate(), 
                    end: moment.utc().add(2, 'days').toDate() 
                }
            }
        });

        // Guardar la nueva deuda en MongoDB
        await nuevaDeuda.save();

        
        const  postData = {
            debt: {
                docId: nuevaDeuda.debt.docId,
                amount: {
                    currency: nuevaDeuda.debt.amount.currency,
                    value: nuevaDeuda.debt.amount.value
                },
                label: nuevaDeuda.debt.label,
                validPeriod: {
                    start: moment(nuevaDeuda.debt.validPeriod.start).format("YYYY-MM-DDTHH:mm:ss"),
                    end: moment(nuevaDeuda.debt.validPeriod.end).format("YYYY-MM-DDTHH:mm:ss")
                }
            }
        };

        
        const headers = {
            "apikey": "ap-059810e8f428f5702438f86f", 
            "Content-Type": "application/json",
            "x-if-exists": "update" // Control sobre si la deuda ya existe
        };

      
        const response = await axios.post('https://staging.adamspay.com/api/v1/debts', postData, { headers });

        
        if (response.data.debt) {
            res.status(201).json({
                message: "Deuda creada exitosamente",
                payUrl: response.data.debt.payUrl,// URL de pago retornada por Adams Pay
            });
            
        } else {
            res.status(400).json({
                message: "Error al crear la deuda",
                meta: response.data.meta,
            });
        }
    } catch (error) {
        console.error("Error al procesar la solicitud:", error.response ? error.response.data : error.message);
        res.status(500).json({
            message: "Error al procesar la solicitud",
            error: error.response ? error.response.data : error.message
            
        });
    }
    
    
};




const deudasPut = (req, res = response) => {
    const { id } = req.params//el nombre que le pusimos a la ruta
    res.json({

        msg: 'put API - controlador - productosPut',
        id

    });
}

const deudasDelete = (req, res = response) => {

    res.json({

        msg: 'Delete API - controlador -productosDelete'

    });
}


module.exports = {
    deudasPut,
    deudasGet,
    deudasPost,
    deudasDelete


}