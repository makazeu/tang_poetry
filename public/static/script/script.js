/*** ajax begins ***/
function getPoetry(poetry_id) {
    var data = {
        pid : poetry_id,
    };

    $.ajax({
        url     : '/api/poetry',
        data    : data,
        type    : 'post',
        dataType: 'json',
        timeout : 15000,
        beforeSend: function(){
            $('.my-loading').fadeIn();
        },
        error: function(){

        },
        complete: function() {
            $('.my-loading').fadeOut();
        },
        success: function(data) {
            //console.log(data);
            if (data.success == true) {
                if (data.resultNum > 0) {
                    data.result.title = replaceDot(data.result.title);
                    $('.poetry-title').html(data.result.title);
                    $('.poetry-author').html(data.result.name)
                                        .attr('href', '/search?author=' + data.result.name);
                    //$('.poetry-author').html(data.result.name).attr('href', '/poet/' + data.result.poet_id);
                    $('.poetry-content').html(data.result.content.split('。').join('。<br>'));
                    $('title').html( data.result.name + ' - ' + data.result.title + ' | ' + $('title').html());
                    $('.poetry-block').fadeIn();
                }
            }

        }
    });
}

function getSearchResult(poet, poetry, title, page) {
    if(!poet && !poetry && !title && !page) {
        $('.search-block').append(
            $('<p> 請輸入關鍵字開始檢索！</p>')
        ).fadeIn();

        return;
    }
        
    var data = {
        poet    : poet,
        poetry  : poetry,
        title   : title,
        page    : page,
    };

    $.ajax({
        url     : '/api/search',
        data    : data,
        type    : 'post',
        dataType: 'json',
        timeout : 15000,
        beforeSend: function(){
            $('.my-loading').fadeIn();

            /* Empty the search-result-block */
            $('.search-block').empty();
            $('.search-block').fadeOut();
        },
        error: function(){

        },
        complete: function() {
            $('.my-loading').fadeOut();
        },
        success: function(data) {
            //console.log(data);
            /* Rewite the uri */
            rewriteURL(data.searchQuery);

            if(data.success == true) {

                /* Prints the number of results if nothing found */
                if(data.resultNum < 1) {
                    $('.search-block').append(
                        $('<p> 沒有檢索到任何結果！</p>')
                    );
                }                

                for(var i in data.result) {
                    insertSearchResult(data.result[i]);
                }

                /* Draws Next & Previous-Page Button */
                if (data.searchQuery.page > 1 || data.resultNum >= 20) {
                    var pager = $('<ul class="pager"></ul>');
                    /* Previous-Page Button */
                    if(data.searchQuery.page > 1) {
                        pager.append(
                            $('<li class="previous">    \
                                <a href="#" class="pager-font" \
                                onclick="enablePagerButton(this)"> \
                                <span aria-hidden="true">&larr;</span> 前一頁</li>')
                        );
                    }

                    if(data.resultNum >= 20) {
                        pager.append(
                            $('<li class="next">    \
                                <a href="#" class="pager-font" \
                                onclick="enablePagerButton(this, true)"> \
                                後一頁 <span aria-hidden="true">&rarr;</span></li>')
                        );
                    }

                    $('.search-block').append(pager);
                }
            }

            /* Show the result */
            $('.search-block').fadeIn();
        },
    });
}
/*** ajax ends ***/



/*
 * Gets the value of given name from GET parameters
 * function : findGetParameter
 * parameter: parameterName(String)
 * returns  : foundParameterValue(String)
 */
function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    location.search
    .substr(1)
        .split("&")
        .forEach(function (item) {
        tmp = item.split("=");
        if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    });
    return result;
}

/* Add a background color to the given string */
function getStringColored(str, begin, length) {
    return str.substr(0, begin) 
            + '<span class="search-highlight">'
            + str.substr(begin, length)
            + '</span>'
            + str.substr(begin + length);
}


function replaceDot(str) {
    return str.replace(/。/g, '·');
}

/* Post processing of received data. */
function processPoetry(poetry) {
    //poetry.title = poetry.title.replace('。','·');
    poetry.title = replaceDot(poetry.title);

    /* Limit of displayed length */
    var maxLength       = 30;

    var keyword = '';
    var str = undefined;
    if(str = findGetParameter('content')) {
        keyword = str.split(' ')[0];
        var pos = poetry.content.indexOf(keyword);
        
        if (pos >= 0) {
            var start   = pos - maxLength;
            var end     = pos + keyword.length + maxLength;

            poetry.content = ( start >= 0 ? '.... ' : '')
                + poetry.content.substring( 
                    start >= 0 ?  start : 0, end)
                + ( end >= poetry.content.length ? '':' ....');

            poetry.content = getStringColored(
                poetry.content,
                poetry.content.indexOf(keyword),
                keyword.length
            );
        }
    }

    if(str = findGetParameter('title')) {
        keyword = str.split(' ')[0];
        var pos = poetry.title.indexOf(keyword);

        if (pos >= 0) {
            poetry.title = getStringColored(
                poetry.title,
                poetry.title.indexOf(keyword),
                keyword.length
            );
        }
    }

    if(str = findGetParameter('author')) {
        poetry.content = poetry.content.substr(0, maxLength * 2)
                        + (poetry.content.length > maxLength * 2 ? ' ....' : '');
    }

    return poetry;
}

/* Inserts what we got into search-result-block. */
function insertSearchResult(poetry) {
    //Post processing
    poetry = processPoetry(poetry);

    var panel = $('<div class="panel panel-default my-panel"></div>');
    
    /* Panel Heading, author & title included. */
    var panel_head = $('<div class="panel-heading"></div>')
                .html('<h3 class="panel-title">' 
                + '<a href="/poetry/' + parseInt(poetry.id) + '" target="_blank">'
                + poetry.name + ' 《' + poetry.title +'》</a></h3>');

    var panel_body = $('<div class="panel-body"></div>')
                    .html( poetry.content );

    panel.append(panel_head).append(panel_body);
    $('.search-block').append(panel);
}

/* Rewrites the url without refreshing. */
function rewriteURL(param) {
    //console.log(param);
    var stateObj    = {};
    var keywords    = '';
    var title       = '全唐詩檢索 - ';
    var newUrl      = '/search?';

    if($.isArray(param.title)) {
        stateObj.title    = param.title.join(' ');
        keywords    += stateObj.title;
    }
    if($.isArray(param.poetry)) {
        stateObj.content    = param.poetry.join(' ');
        keywords    += stateObj.content;
    }
    if($.isArray(param.poet)) {
        stateObj.author    = param.poet.join(' ');
        keywords    += stateObj.author;
    }


    rewriteTextbox(keywords);
    title += keywords;
    if(param.page && param.page > 1) {
        stateObj.page = param.page;
        title += (' 第' + param.page +'頁');
    }

    newUrl += parseParam(stateObj);
    //console.log(title);
    history.pushState(stateObj, title, newUrl);
}

/* Sets the default value of search box. */
function rewriteTextbox(str) {
    $('input').val(str);
}


/*
 * Turns a Array to Url with parameters.
 */
function parseParam(param, key) {   
    var paramStr = '';  
    //console.log(param);
    if(param instanceof String||param instanceof Number||param instanceof Boolean){  
        paramStr+="&"+key+"="+encodeURIComponent(param);  
    }else{  
        $.each(param,function(i){  
            var k=key==null?i:key+(param instanceof Array?"["+i+"]":"."+i);  
            paramStr+='&'+parseParam(this, k);  
        });  
    }  
    return paramStr.substr(1);  
}; 

/* Search function, called by the search button */
function doSearch(type) {
    var query = $('input').val().trim();
    
    if( !query || query == '') {
        $('input').val('請輸入檢索關鍵字！');
        //$('input').css("color","red");
        return;
    }

    if(window.location.href.indexOf('/search') == -1) {
        var newUrl = '/search?';
        
        newUrl += ( type + '=' + query );
        window.location.href = newUrl;
    }

    if (type == 'content') {
        getSearchResult('', query, '', 1);
    }
    else if (type == 'title') {
        getSearchResult('', '', query, 1);
    }
    else if (type == 'author') {
        getSearchResult(query, '', '', 1);
    }
}

function enablePagerButton(obj, isNext = false) {
    var page = findGetParameter('page') ? parseInt(findGetParameter('page')) : 1;
    getSearchResult(
        findGetParameter('author'),
        findGetParameter('content'),
        findGetParameter('title'),
        (isNext ? page + 1 : page - 1).toString()
    );
}

/* Listener on keypress event */
$(function(){ 
    var inputBox = $('input');
    inputBox.keypress(function(e) {
        var key = e.which;
        if(key == 13){
            doSearch('content');
        }
    }); 
});

function insertPoet(objId, poets, start, end) {
    var table = $('#' + objId);
    for(var i = start - 1; i < end; i++) {
        table.append(
            $('<tr></tr>')
            .append( $('<td></td>').append(
                $('<a></a>').html(poets[i].name)
                            .attr('href', '/search?author=' + poets[i].name)
            ) )
            .append( $('<td></td>').html(poets[i].num) )
        );
    }
}

function showPoets() {
    var poets = [
        {"name":"白居易","num":2643},
        {"name":"杜甫","num":1158},
        {"name":"李白","num":896},
        {"name":"佚名","num":841},
        {"name":"齐己","num":783},
        {"name":"刘禹锡","num":703},
        {"name":"元稹","num":593},
        {"name":"李商隐","num":555},
        {"name":"贯休","num":553},
        {"name":"韦应物","num":551},
        {"name":"刘长卿","num":508},
        {"name":"许浑","num":507},
        {"name":"皎然","num":506},
        {"name":"陆龟蒙","num":502},
        {"name":"杜牧","num":487},
        {"name":"罗隐","num":470},
        {"name":"张籍","num":467},
        {"name":"姚合","num":458},
        {"name":"钱起","num":429},
        {"name":"贾岛","num":405}
    ];

    insertPoet('table1', poets, 1, 10);
    insertPoet('table2', poets, 11, 20);
}