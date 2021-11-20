const createError = require('http-errors');
const express = require('express');
const exphbs = require('express-handlebars')
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const swaggerUi =  require('swagger-ui-express')
const helmet =  require('helmet')
const compression =  require('compression')

const indexRouter = require('./routes/index');

const app = express();


const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'views')
app.set('views', 'views')

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use('/api-docs', swaggerUi.serve)
//app.use(helmet())
app.use(compression())


app.use('/', indexRouter);

app.use(function (req, res, next) {
    next(createError(404));
});

app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
