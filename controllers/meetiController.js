const Grupos = require('../models/Grupos');
const Meeti = require('../models/Meeti');

exports.formNuevoMeeti = async (req, res) => {
  const grupos = await Grupos.findAll({ where: { usuarioId: req.user.id } });
  res.render('nuevo-meeti', {
    nombrePagina: 'crea un nuevo meeti',
    grupos,
  });
};

exports.crearMeeti = async (req, res) => {
  const meeti = req.body;
  //usuario
  meeti.usuarioId = req.user.id;
  //almacena ubic con un point
  const point = {
    type: 'Point',
    coordinates: [parseFloat(req.body.lng), parseFloat(req.body.lat)],
  };
  console.log(req.body.lat, parseFloat(req.body.lat));
  meeti.ubicacion = point;

  if (req.body.cupo === '') meeti.cupo = 0;

  //almacenar en la BD
  try {
    await Meeti.create(meeti);
    req.flash('exito', 'Se ha creado un nuevo meeti');
    res.redirect('/administracion');
  } catch (error) {
    console.log(error);

    const erroresSequelize = error.errors.map((err) => err.message);

    req.flash('error', erroresSequelize);
    res.redirect('/nuevo-meeti');
  }
};

exports.sanitizarMeeti = (req, res, next) => {
  req.sanitizeBody('titulo');
  req.sanitizeBody('invitado');
  req.sanitizeBody('cupo');
  req.sanitizeBody('fecha');
  req.sanitizeBody('hora');
  req.sanitizeBody('direccion');
  req.sanitizeBody('lat');
  req.sanitizeBody('lng');
  req.sanitizeBody('grupoId');
  next();
};

exports.formEditarMeeti = async (req, res) => {
  const consultas = [];
  consultas.push(Grupos.findAll({ where: { usuarioId: req.user.id } }));
  consultas.push(Meeti.findByPk(req.params.id));

  const [grupos, meeti] = await Promise.all(consultas);

  if (!grupos || !meeti) {
    req.flash('error', 'operacion novalida');
    res.redirect('/administracion');
    return next();
  }

  console.log(meeti.ubicacion);
  res.render('editar-meeti', {
    nombrePagina: `Editar un meeti ${meeti.titulo} `,
    grupos,
    meeti,
  });
};

//almacen los cambios en el meeti
exports.editarMeeti = async (req, res) => {
  const meeti = await Meeti.findOne({
    where: {
      id: req.params.id,
      usuarioId: req.user.id,
    },
  });

  const {
    grupoId,
    titulo,
    invitado,
    fecha,
    hora,
    cupo,
    descripcion,
    direccion,
    ubicacion,
    lat,
    lng,
  } = req.body;

  meeti.grupoId = grupoId;
  meeti.titulo = titulo;
  meeti.invitado = invitado;
  meeti.fecha = fecha;
  meeti.hora = hora;
  meeti.cupo = cupo;
  meeti.descripcion = descripcion;
  meeti.direccion = direccion;
  meeti.ubicacion = ubicacion;

  const point = {
    type: 'Point',
    coordinates: [parseFloat(lng), parseFloat(lat)],
  };

  meeti.ubicacion = point;

  //almacenar en la BD
  await meeti.save();
  req.flash('exito', 'cambios guardados correctamente');
  res.redirect('/administracion');
};
