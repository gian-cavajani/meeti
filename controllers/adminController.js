const Grupos = require('../models/Grupos.js');
const Meeti = require('../models/Meeti.js');
const moment = require('moment');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.panelAdministracion = async (req, res) => {
  // moment(new Date()).format('YYYY-MM-DD')//formateo como la BD
  const ahora = () => moment(new Date()).format('YYYY-MM-DD');
  //consultas
  const consultas = [];
  consultas.push(Grupos.findAll({ where: { usuarioId: req.user.id } }));
  //traer solo meetis del futuro
  consultas.push(
    Meeti.findAll({
      where: {
        usuarioId: req.user.id,
        fecha: { [Op.gte]: ahora() },
      },
    })
  );
  //trae solo meetis del pasado
  consultas.push(
    Meeti.findAll({
      where: {
        usuarioId: req.user.id,
        fecha: { [Op.lt]: ahora() },
      },
    })
  );

  //array destructuring
  const [grupos, meeti, meetiAnteriors] = await Promise.all(consultas);

  res.render('administracion', {
    nombrePagina: 'Panel de Administracion',
    grupos,
    meeti,
    meetiAnteriors,
    moment,
  });
};
