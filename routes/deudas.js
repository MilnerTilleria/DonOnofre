//TO DO LAS FUNCIONES DE LAS DEUDAS

const {Router}= require('express');
const { deudasGet, deudasPut, deudasPost, deudasDelete} = require('../controllers/deudas');

const router= Router();

router.get('/',  deudasGet);

  router.put('/:id', deudasPut );

  router.post('/',  deudasPost );
   
 

  router.delete('/',  deudasDelete);
   
  

module.exports= router;