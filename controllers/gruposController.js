const { Sequelize } = require('sequelize');
const Categorias = require('../models/Categorias');
const Grupos = require('../models/Grupos.js');

const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs');

const configuracionMulter = {
  limits: { filesize: 100000 },
  storage: (fileStorage = multer.diskStorage({
    destination: (req, file, next) => {
      next(null, __dirname + '/../public/uploads/grupos/');
    },
    filename: (req, file, next) => {
      const extension = file.mimetype.split('/')[1];
      next(null, `${shortid.generate()}.${extension}`);
    },
  })),
  fileFilter(req, file, next) {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      next(null, true);
    } else {
      next(new Error('Archivo con formato no valido'), false);
    }
  },
};

const upload = multer(configuracionMulter).single('imagen');

//sube imagen en el serv
exports.subirImagen = (req, res, next) => {
  upload(req, res, function (error) {
    if (error) {
      if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
          req.flash('error', 'archivo muy grande');
        } else {
          req.flash('error', error.message);
        }
      } else if (error.hasOwnProperty('message')) {
        req.flash('error', error.message);
      }
      //todo manejar
      console.log(error);
      res.redirect('back');
      return;
    } else {
      console.log(req);
      next();
    }
  });
};

exports.formNuevoGrupo = async (req, res) => {
  const categorias = await Categorias.findAll();
  res.render('nuevo-grupo', {
    nombrePagina: 'crea un nuevo grupo',
    categorias,
  });
};

exports.crearGrupo = async (req, res) => {
  //sanitizar??
  req.sanitizeBody('nombre');
  req.sanitizeBody('url');

  const grupo = req.body;
  if (req.user) grupo.usuarioId = req.user.id;
  grupo.categoriaId = req.body.categoria;

  //leer imagen
  if (req.file) grupo.imagen = req.file.filename;

  try {
    await Grupos.create(grupo);
    req.flash('exito', 'Se ha creado un nuevo grupo');
    res.redirect('/administracion');
  } catch (error) {
    console.log(error);

    const erroresSequelize = error.errors.map((err) => err.message);

    req.flash('error', erroresSequelize);
    res.redirect('/nuevo-grupo');
  }
  console.log(grupo);
};

exports.formEditarGrupo = async (req, res) => {
  // const grupo = await Grupos.findByPk(req.body.grupoId) //
  // const categorias = await Categorias.findAll(); //espera a que la consulta de grupo finalice para recien ahi hace la consulta de categoria

  const consultas = [];
  consultas.push(Grupos.findByPk(req.params.grupoId));
  consultas.push(Categorias.findAll());

  const [grupo, categorias] = await Promise.all(consultas); //hace que el await se ejecute a la misma vez para ambas consultas

  res.render('editar-grupo', {
    nombrePagina: `Editar grupo: ${grupo.nombre}`,
    grupo,
    categorias,
  });
};

exports.editarGrupo = async (req, res) => {
  const grupo = await Grupos.findOne({
    where: { id: req.params.grupoId, usuarioId: req.user.id },
  });

  //si no existe ese grupo o no es el duenio
  if (!grupo) {
    req.flash('error', 'operacion no valida');
    res.redirect('/administracion');
    return next();
  }

  console.log(req.body);
  //todo bien, leer los valores
  const { nombre, descripcion, categoria, url } = req.body;

  //asignar valores
  grupo.nombre = nombre;
  grupo.descripcion = descripcion;
  grupo.categoriaId = categoria;
  grupo.url = url;

  await grupo.save();
  req.flash('exito', 'grupo editado correctamente');
  res.redirect('/administracion');
};
//muestra form para editar imagen
exports.formEditarImagen = async (req, res) => {
  //   const grupo = await Grupos.findByPk(req.params.grupoId);
  const grupo = await Grupos.findOne({
    where: { id: req.params.grupoId, usuarioId: req.user.id },
  });

  res.render('imagen-grupo', {
    nombrePagina: `Editar img del grupo: ${grupo.nombre}`,
    grupo,
  });
};
//edita imagen en la bd
exports.editarImagen = async (req, res, next) => {
  //   const grupo = await Grupos.findByPk(req.params.grupoId);
  //trae el grupo con el usuario logueado y el grupo seleccionado que viene por paramentros de la uurl
  const grupo = await Grupos.findOne({
    where: { id: req.params.grupoId, usuarioId: req.user.id },
  });

  if (!grupo) {
    req.flash('error', 'Operacion no valida');
    res.redirect('/administracion');
    return next();
  }

  //si hay imagen anterior y nueva, significa que vamos a borrar la anterior.
  if (req.file && grupo.imagen) {
    const imgAnteriorPath =
      __dirname + `/../public/uploads/grupos/${grupo.imagen} `;

    //   eliminar archivo con fs
    fs.unlink(imgAnteriorPath, (error) => {
      if (error) {
        console.log(error);
      }
      return;
    });
  }

  //si hay imagen nueva sin excepciones la va a guardar
  if (req.file) {
    grupo.imagen = req.file.filename;
  }

  await grupo.save();
  req.flash('exito', 'cambios almacenados correctamente');
  res.redirect('/administracion');
};

//muestra formulario para borrar grupo
exports.formEliminarGrupo = async (req, res, next) => {
  //trae el grupo con el usuario logueado y el grupo seleccionado que viene por paramentros de la uurl
  const grupo = await Grupos.findOne({
    where: { id: req.params.grupoId, usuarioId: req.user.id },
  });

  if (!grupo) {
    req.flash('error', 'operacion no valida');
    res.redirect('/administracion');
    return next();
  }

  res.render('eliminar-grupo', {
    nombrePagina: `Eliminar grupo: ${grupo.nombre}`,
  });
};

exports.eliminarGrupo = async (req, res, next) => {
  //trae el grupo con el usuario logueado y el grupo seleccionado que viene por paramentros de la uurl
  const grupo = await Grupos.findOne({
    where: { id: req.params.grupoId, usuarioId: req.user.id },
  });

  if (!grupo) {
    req.flash('error', 'Operacion no valida');
    res.redirect('/administracion');
    return next();
  }

  //si hay imagen anterior vamos a borrar la anterior.
  if (grupo.imagen) {
    const imgAnteriorPath =
      __dirname + `/../public/uploads/grupos/${grupo.imagen} `;

    //   eliminar archivo con fs
    fs.unlink(imgAnteriorPath, (error) => {
      if (error) {
        console.log(error);
      }
      return;
    });
  }

  //eliminar el grupo
  await Grupos.destroy({
    where: {
      id: req.params.grupoId,
    },
  });

  //   await grupo.save();
  req.flash('exito', 'Grupo eliminado');
  res.redirect('/administracion');
};
