const mongoose = require('mongoose');



const dbConnection = async () => {

    try {
        await mongoose.connect(process.env.MONGODB_CNN, {
        })

        console.log('Base de datos on');
    } catch (error) {
        console.log(error)
        throw new Error("error a la hora de iniciar la db");

    }

};

module.exports = {
    dbConnection,
}