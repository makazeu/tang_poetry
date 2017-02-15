var path   = require('path');
var api    = require('./api');
var render = require('./render');


module.exports = function (app) {
    /*
    app.get('/', function (req, res) {
        res.sendFile(path.resolve('views/index.html'));
    });*/
    app.get('/', function(req, res) {
        res.render('index');
    });

    app.get('/poetry/:poetry_id', function(req, res){
        res.render('poetry', {poetry_id : req.params.poetry_id});
    });

    /*
    app.get('/poet/:poet_id', function(req, res) {
        res.redirect('/search?')
    });
    */

    app.get('/search', function(req, res){
        res.render('search');
    });

    //app.post('/api/poetry', api.getPoetry);
    app.route('/api/poetry')
        .post(api.getPoetry);

    app.route('/api/search')
        .post(api.doSearch);

    app.route('/api/poets')
        .get(api.getPoets);
};
