const passport = require('passport')

exports.autenticarUsuario = passport.authenticate('local',{
    successRedirect: '/administracion',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage : 'ambos campos son obligatorios'
})



//revisa si user esta authenticado o no
exports.usuarioAutenticado = (req,res,next) => {
    //si esta autenticado, adelante ->
    if(req.isAuthenticated()){
        return next()
    }

    //sino esta autenticado
    return res.redirect('/iniciar-sesion')

}
