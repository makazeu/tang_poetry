var express = require('express'),
    hbs     = require('hbs'),
    favicon = require('serve-favicon'),
    app     = express();

var bodyParser = require('body-parser'),
    path = require('path');

// constants
app.set('port', process.env.PORT || 5000);

// template rendering
app.set('view engine', 'hbs');

// middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(favicon(__dirname + '/public/favicon.ico'));

// static files
app.use(express.static(path.join(__dirname, 'public')));

/* routes */
var routes = require('./routes')(app);

// start serving
app.listen(app.get('port'), '0.0.0.0');
