var dbObj = require('./dao');

var poet_num_per_page = 20;

exports.getPoetryById = function (poetry_id, func) {
    var queryResult = {};
    var queryString = 'SELECT poetries.*, poets.name FROM poetries, \
        poets WHERE poetries.poet_id = poets.id AND poetries.id = ' + poetry_id;
    dbObj.query(queryString, function (result) {
        if (result == -1) {
            // Error
            queryResult.success = false;
            func(queryResult);
        }
        else if (result) {
            //console.log(queryString, result);
            queryResult.success   = true;
            queryResult.resultNum = result.length;
            if (queryResult.resultNum > 0) {
                queryResult.result    = result[0];
            }
            func(queryResult);
        }
    });
}

exports.getPoetry = function (limitNum, func) {
    var queryResult = {};
    var queryString = 'SELECT name, num FROM poets ORDER BY num DESC LIMIT '
                    + limitNum.toString();

    dbObj.query(queryString, function (result) {
        if (result == -1) {
            // Error
            queryResult.success = false;
            func(queryResult);
        }
        else if (result) {
            //console.log(queryString, result);
            queryResult.success   = true;
            queryResult.resultNum = result.length;
            if (queryResult.resultNum > 0) {
                queryResult.result    = result;
            }
            func(queryResult);
        }
    });
}

exports.doSearchAction = function (searchQuery, func) {
    var queryResult = {};
    var queryString = 'SELECT poetries.*, poets.name FROM poetries, \
        poets WHERE poetries.poet_id = poets.id ';
    
    for(var i in searchQuery.title) {
        queryString += (' AND title LIKE \'%' + searchQuery.title[i] + '%\' ');
    }

    for(var i in searchQuery.poetry) {
        queryString += (' AND content LIKE \'%' + searchQuery.poetry[i] + '%\' ');
    }

    for(var i in searchQuery.poet) {
        queryString += (' AND name LIKE \'%' + searchQuery.poet[i] + '%\' ');
    }

    queryString += (' LIMIT ' + 
        ((searchQuery.page-1)*poet_num_per_page).toString() + ' ,20');

    /* Prints debugging info to browser console. */
    //queryResult.queryString = queryString;

    dbObj.query(queryString, function (result) {
        if (result == -1) {
            // Error
            queryResult.success = false;
            func(queryResult);
        }
        else if (result) {
            //console.log(queryString, result);
            queryResult.success   = true;
            queryResult.resultNum = result.length;
            if (queryResult.resultNum > 0) {
                queryResult.result    = result;
            }
            func(queryResult);
        }
    });
}

