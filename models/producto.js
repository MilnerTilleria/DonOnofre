const { Schema, model } = require('mongoose');

const ProductoSchema = Schema({
    id: {
        type: Number,
    },
    name: {
        type: String,
    },
    precio: {
        type: Number
    },
    img: {
        type: String,
    },
    stock: {
        type: Number,
    },
    estado: {
        type:Boolean,
        default:true,
    },
});

ProductoSchema.methods.toJSON = function () { 
    const { __v, _id, ...producto } = this.toObject();
    producto.uid = _id
    return producto
}



module.exports = model('Producto', ProductoSchema); 