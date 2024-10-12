const { response, request, query } = require('express')
const Producto = require('../models/producto')


const productosGet = async (req = request, res = response) => {
    const { limite = 11, desde = 0 } = req.query

    const query = { estado: true };
    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .skip(desde)
            .limit(limite)
    ]);
    res.json({

        total,
        productos
    });
}

const productosPost = async (req, res = response) => {
    const { name, precio, stock } = req.body;
    const producto = new Producto({ name, precio, stock });

    await producto.save();
    res.status(201).json({

        producto
    });
}


const productosPut = async(req, res = response) => {
    const { id } = req.params
    const {nombre, _id, uid, ...resto } = req.body

    const producto = await Producto.findByIdAndUpdate(id, resto);
    res.json({

        producto

    });
}

const productosDelete = async(req, res = response) => {
    const { id } = req.params
    const producto= await Producto.findByIdAndUpdate(id, {estado: false})
    res.json({

        msg: 'articulo borrado',
        id

    });
}


module.exports = {
    productosPut,
    productosGet,
    productosPost,
    productosDelete


}