const Sequelize = require('sequelize');
const db = require('../config/db');
const slug = require('slug');
const shortid = require('shortid');
const Usuarios = require('../models/usuarios');
const Grupos = require('../models/Grupos');

const Meeti = db.define(
  'meeti',
  {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: crypto.randomUUID(),
    },
    titulo: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Agrega un titulo',
        },
      },
    },
    slug: { type: Sequelize.STRING },
    invitado: Sequelize.STRING,
    cupo: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    descripcion: {
      type: Sequelize.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Agrega una descripcion',
        },
      },
    },
    fecha: {
      type: Sequelize.DATEONLY, //anio, mes y dia (sin hora)
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Agrega una fecha',
        },
      },
    },
    hora: {
      type: Sequelize.TIME, //()hora)
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Agrega una hora',
        },
      },
    },
    direccion: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Agrega una direccion',
        },
      },
    },
    ubicacion: {
      type: Sequelize.GEOMETRY('POINT'),
    },
    interesados: {
      type: Sequelize.ARRAY(Sequelize.INTEGER), //array de enteros
      defaultValue: [],
    },
  },
  {
    hooks: {
      async beforeCreate(meeti) {
        const url = slug(meeti.titulo).toLowerCase();
        meeti.slug = `${url}-${shortid.generate()}`;
      },
    },
  }
);

Meeti.belongsTo(Usuarios);
Meeti.belongsTo(Grupos);

module.exports = Meeti;
