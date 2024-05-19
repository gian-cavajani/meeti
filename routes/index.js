const express = require('express');
const router = express.Router();

const homeController = require('../controllers/homeController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController')
const adminController = require('../controllers/adminController')
const gruposController = require('../controllers/gruposController')

module.exports = function () {
  router.get('/', homeController.home);
  
  router.get('/crear-cuenta', usuariosController.formCrearCuenta);
  router.post('/crear-cuenta', usuariosController.crearNuevaCuenta);

  //crear y confirmar cuentas
  router.get('/confirmar-cuenta/:correo', usuariosController.confirmarCuenta)

  router.get('/iniciar-sesion',usuariosController.formIniciarSesion)
  router.post('/iniciar-sesion', authController.autenticarUsuario)

  //panel admin
  router.get('/administracion', authController.usuarioAutenticado, adminController.panelAdministracion)
  

  //nuevos grupos
  router.get('/nuevo-grupo', authController.usuarioAutenticado, gruposController.formNuevoGrupo)
  router.post('/nuevo-grupo', gruposController.subirImagen , gruposController.crearGrupo)
  //editar grups
  router.get('/editar-grupo/:grupoId',
    authController.usuarioAutenticado,
    gruposController.formEditarGrupo
  )
  router.post('/editar-grupo/:grupoId',
    authController.usuarioAutenticado,
    gruposController.editarGrupo
  )

  return router;
};
  

