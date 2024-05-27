const express = require('express');
const path = require('path');
const router = require('./routes');
const expressEjsLayouts = require('express-ejs-layouts');
const db = require('./config/db');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const passport = require('./config/passport');

//modelos
require('./models/usuarios');
require('./models/Categorias');
require('./models/Grupos');
require('./models/Meeti');

//conexion a db
db.sync()
  .then(() =>
    console.log(
      'DB conectada ' + new Date().getHours() + ':' + new Date().getMinutes()
    )
  )
  .catch((error) => console.log(error));

//variables de desarrollo
require('dotenv').config({ path: 'variables.env' });

// App prinicipal
const app = express();

//body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); //permite leer varios tipos de archivo (ejemplo: img)

//expressValidator
app.use(expressValidator());

//habilitar EJS como template engine
app.use(expressEjsLayouts);
app.set('view engine', 'ejs');

//Ubicacion vistas
app.set('views', path.join(__dirname, './views'));

//archivos staticos
app.use(express.static('public'));

//habilitar cookie parser
app.use(cookieParser());

//crear la session
app.use(
  session({
    secret: process.env.SECRETO,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false,
  })
);

//inicializar passport
app.use(passport.initialize());
app.use(passport.session());

//flash messages
app.use(flash());

//Middleware (usuario logueado,flash messages, fecha actual)
app.use((req, res, next) => {
  res.locals.mensajes = req.flash(); //se va a ir llenando esto con los mensajes flash()
  const fecha = new Date();
  res.locals.year = fecha.getFullYear();
  next();
});

//routing
app.use('/', router());

//puerto y arrancar el proyecto.
app.listen(process.env.PORT, () => {
  console.log(`server working on port ${process.env.PORT}`);
});
