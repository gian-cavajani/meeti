const Sequelize = require('sequelize')
const db = require('../config/db')
// const uuid = require('uuid/v4')
const Categorias = require('./Categorias') //1-1 (1Grupo - 1Cat)
const Usuarios = require('./usuarios') //1-1 (1Grupo - 1USer)

const Grupos = db.define('grupos',{
    id:{
        type:Sequelize.UUID,
        primaryKey:true,
        allowNull:false,
        defaultValue:crypto.randomUUID()
    },
    nombre:{
        type:Sequelize.TEXT(100),
        allowNull:false,
        validate:{
            notEmpty:{
                msg: 'El grupo debe tener nombre'
            }
        }
    },
    descripcion:{
        type:Sequelize.TEXT,
        allowNull:false,
        validate: {
            notEmpty:{
                msg: "Descripcion no puede estar vacia"
            }
        }
    },
    url:Sequelize.TEXT,
    imagen: Sequelize.TEXT
})

Grupos.belongsTo(Categorias, { foreignKey: { allowNull: false },validate:{notNull:{msg:'Debe elegir una categoria'}}, onDelete: 'CASCADE' })//1a1
Grupos.belongsTo(Usuarios)//1a1

module.exports = Grupos