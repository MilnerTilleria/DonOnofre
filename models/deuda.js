const { Schema, model } = require('mongoose');
const { v4 : uuidv4 } = require('uuid');

const DeudaSchema = Schema({
    
        debt: {
            docId: {
                type: String,
                default:uuidv4(),

            },
            amount: {
                currency: {
                    type: String,
                    default: "PYG"
                },
                value: {
                    type: Number,
                    default: 20000
                }
            },
            label: {
                type: String,
                default: "compra carrito"
            },
            validPeriod: {
                start: {
                    type: Date,
                    default: new Date("2024-10-06T15:46:23+0000")
                },
                end: {
                    type: Date,
                    default: new Date("2024-10-10T15:46:23+0000")
                }
            },
        }
    
});

DeudaSchema.methods.toJSON = function () { 
    const { __v, _id, ...deuda } = this.toObject();
    deuda.uid = _id
    return deuda
}



module.exports = model('Deuda', DeudaSchema); 