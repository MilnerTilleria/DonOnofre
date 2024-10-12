const { Schema, model } = require('mongoose');


const PagoSchema = Schema({


    docId: {
        type: String,
    

    },
    payStatus:{
        type:String
    }

});

PagoSchema.methods.toJSON = function () {
    // const { __v, _id, ...deuda } = this.toObject();
    // pago.uid = _id
    return pago
}



module.exports = model('Pago', PagoSchema); 