const express = require('express');
const router = express.Router();

const homeController = require('../controllers/homeController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');
const adminController = require('../controllers/adminController');
const gruposController = require('../controllers/gruposController');
const meetiController = require('../controllers/meetiController');

module.exports = function () {
  router.get('/', homeController.home);

  router.get('/crear-cuenta', usuariosController.formCrearCuenta);
  router.post('/crear-cuenta', usuariosController.crearNuevaCuenta);

  //crear y confirmar cuentas
  router.get('/confirmar-cuenta/:correo', usuariosController.confirmarCuenta);

  router.get('/iniciar-sesion', usuariosController.formIniciarSesion);
  router.post('/iniciar-sesion', authController.autenticarUsuario);

  //panel admin
  router.get(
    '/administracion',
    authController.usuarioAutenticado,
    adminController.panelAdministracion
  );

  //nuevos grupos
  router.get(
    '/nuevo-grupo',
    authController.usuarioAutenticado,
    gruposController.formNuevoGrupo
  );
  router.post(
    '/nuevo-grupo',
    gruposController.subirImagen,
    gruposController.crearGrupo
  );
  //editar grups
  router.get(
    '/editar-grupo/:grupoId',
    authController.usuarioAutenticado,
    gruposController.formEditarGrupo
  );
  router.post(
    '/editar-grupo/:grupoId',
    authController.usuarioAutenticado,
    gruposController.editarGrupo
  );

  //editar img del grupo
  router.get(
    '/imagen-grupo/:grupoId',
    authController.usuarioAutenticado,
    gruposController.formEditarImagen
  );
  router.post(
    '/imagen-grupo/:grupoId',
    authController.usuarioAutenticado,
    gruposController.subirImagen,
    gruposController.editarImagen
  );

  //eliminar grupo
  router.get(
    '/eliminar-grupo/:grupoId',
    authController.usuarioAutenticado,
    gruposController.formEliminarGrupo
  );
  router.post(
    '/eliminar-grupo/:grupoId',
    authController.usuarioAutenticado,
    gruposController.eliminarGrupo
  );

  //nuevos meeti
  router.get(
    '/nuevo-meeti',
    authController.usuarioAutenticado,
    meetiController.formNuevoMeeti
  );
  router.post(
    '/nuevo-meeti',
    authController.usuarioAutenticado,
    meetiController.sanitizarMeeti,
    meetiController.crearMeeti
  );

  //editar meeti
  router.get(
    '/editar-meeti/:id',
    authController.usuarioAutenticado,
    meetiController.formEditarMeeti
  );
  router.post(
    '/editar-meeti/:id',
    authController.usuarioAutenticado,
    meetiController.editarMeeti
  );

  return router;
};
