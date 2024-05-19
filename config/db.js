const Sequelize = require('sequelize');

//conexion a DB:

//mac
module.exports = new Sequelize('meeti', '', '', {
  host: '127.0.0.1',
  port: '5432',
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },

//PC
  // module.exports = new Sequelize('meeti', 'postgres', 'Perro-2310', {
  //   host: '127.0.0.1',
  //   port: '5432',
  //   dialect: 'postgres',
  //   pool: {
  //     max: 5,
  //     min: 0,
  //     acquire: 30000,
  //     idle: 10000,
  //   },
  // ---------- elimina las columnas por default (createdAy,updatedAt) -----------
  // define:{
  //   timestamps:false
  // }

  //logging:false   -> deshabilita el logging
});
