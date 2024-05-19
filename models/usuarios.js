const Sequelize = require('sequelize');
const db = require('../config/db');
const bcrypt = require('bcrypt-nodejs');

//model definido en bd
const Usuarios = db.define(
  'usuarios',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: Sequelize.STRING(60),
    imagen: Sequelize.STRING(60),
    email: {
      type: Sequelize.STRING(30),
      allowNull: false,
      validate: {
        isEmail: { msg: 'Agrega un correo valido' },
      },
      unique: {
        args: true,
        msg: 'usuario ya registrado',
      },
    },
    password: {
      type: Sequelize.STRING(60),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El pwd no puede estar vacio',
        },
      },
    },
    activo: {
      type: Sequelize.INTEGER,
      default: 0, //0 inactivo, 1 activo
    },
    tokenPassword: Sequelize.STRING,
    expiraToken: Sequelize.DATE,
  },
  {
    //   //esto tira error por la callback function
    hooks: {
      beforeCreate: async (usuario)=>{
        //hashea la pwd
        const salt = await bcrypt.genSaltSync(10,'a')
        usuario.password = bcrypt.hashSync(
          usuario.password,
          salt
        );
      },
    },
  }
);

//Metodo para comparar los password
Usuarios.prototype.validarPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = Usuarios;
