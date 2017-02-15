var path = require('path');
var appCore = require(path.resolve('core/core'));

exports.getPoetry = function (req, res) {
    var poetry_id = req.body.pid;
    appCore.getPoetryById(poetry_id, function(result){
        if(!result.success) {
            res.statusCode = 500;
        }
        res.json(result);
    });
}

exports.getPoets = function (req, res) {
    var poetNum = 20;
    appCore.getPoetry(poetNum, function(result){
        if(!result.success) {
            res.statusCode = 500;
        }
        res.json(result);
    });
}

function clearString(str) {
    var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;|{}【】‘；：”“'。，、？]");
    var rs = ""; 
    for (var i = 0; i < str.length; i++) { 
        rs = rs + str.substr(i, 1).replace(pattern, '');
    }
    return rs;
}

function parseQuery(str) {
    var keywords = {};
    if(str)
        var keywords = clearString(str).trim().replace(/\s+/g, ' ').split(' ');
    return keywords;
}

exports.doSearch = function (req, res) {
    var queryBody = req.body;
    
    var searchQuery = {
        'poet'      :   parseQuery(queryBody.poet),
        'poetry'    :   parseQuery(queryBody.poetry),
        'title'     :   parseQuery(queryBody.title),
        'page'      :   parseInt(queryBody.page) > 0 ? parseInt(queryBody.page) : 1,
    }
    //res.json(searchQuery);

    appCore.doSearchAction(searchQuery, function(result){
        if(!result.success) {
            res.statusCode = 500;
        }
        result.searchQuery = searchQuery;
        res.json(result);
    });
}