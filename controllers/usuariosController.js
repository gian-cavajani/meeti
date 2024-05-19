const Usuarios = require('../models/usuarios');
const enviarEmail = require('../handler/emails')
 //const expressValidator = require('express-validator')

exports.formCrearCuenta = (req, res) => {
  res.render('crear-cuenta', {
    nombrePagina: 'Crea tu cuenta',
  });
};

//async porque espera resp de la BD
exports.crearNuevaCuenta = async (req, res) => {
  const usuario = req.body;

  // console.log(usuario);
  req.checkBody("confirmar","Repetir Password no puede estar vacio").notEmpty();
  req.checkBody("confirmar","Password debe coincidir").equals(req.body.password);
  const erroresExpress = req.validationErrors();
  
  // console.log({erroresExpress});

  try {
    await Usuarios.create(usuario);
    //console.log('usuario creado', nuevoUsuario);
    
    //url de confirmacion
    // const url = `http://${req.header.host}/confirmar-cuenta/${usuario.email}`
    
    // //enviar email de confirmacion
    // await enviarEmail.enviarEmail({
    //   usuario,
    //   url,
    //   subject: "Confirma tu cuenta de meeti",
    //   archivo: 'confirmar-cuenta'
    // })
    
    
    
    //flash
    req.flash('exito', 'Hemos enviado un mail para confirmar')
    res.redirect('/iniciar-sesion')
  } catch (error) {
    console.log(error)
    //extraer el message de los errores de sequelize
    console.log({erroresExpress,seq:error.errors});
    const errorsSequelize = error.errors ? error.errors.map(err => err.message) : []
    
    //extraer el msg de los errores de express, no agarra estos en el catch
    let errExp = []
    if(erroresExpress) errExp = erroresExpress ? erroresExpress.map(err => err.msg) : []
    
    //unir 2 arrays
    const listaErr = [...errorsSequelize,...errExp]

    req.flash("error", listaErr) //esto es utilizado por el middleware -> res.locals.mensajes = req.flash
    res.redirect('/crear-cuenta')
  }

  
 
};

//confirma la suscr del usuario
exports.confirmarCuenta = async (req,res,next) => {

  //verificar que el usuario existe
  const usuario = await Usuarios.findOne({where: {email:req.params.correo}})

  console.log(usuario);
  //sino existe,redireccionar
  if(!usuario){ 
    req.flash('error','No existe esa cuenta') ; 
    res.redirect('/crear-cuenta'); 
    return next()
  }
  //si existe, confirmar suscr y redir
  usuario.activo  = 1;
  await usuario.save()
  req.flash('exito', 'cuenta confirmada, ya puedes iniciar sesion')
  res.redirect('/iniciar-sesion')

}




exports.formIniciarSesion = (req,res) => {
    res.render('iniciar-sesion',{
      nombrePagina: 'Iniciar Sesion'
    })
}