const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const Usuarios = require('../models/usuarios')

passport.use(new localStrategy({
    usernameField: 'email',
    passwordField: "password"
},
async(email,password,next) => {
    //codigo se ejecuta al llenar el formulario
    const usuario = await Usuarios.findOne({
                            where: {email,activo : 1}});
    //revisar si existe
    if(!usuario) return next(null,false,{
        message: 'Ese Usuario no xiste'
    })
    //si existe comparar su pwd
    const verificarPass = usuario.validarPassword(password)
    // pwd incorrecto
    if(!verificarPass) return next(null,false, {
        message: 'pwd incorrecto'
    })
    //todo ok
    return next(null,usuario)
}
))

passport.serializeUser((user,cb)=>{
    cb(null,user)
})
passport.deserializeUser((user,cb)=>{
    cb(null,user)
})

module.exports = passport