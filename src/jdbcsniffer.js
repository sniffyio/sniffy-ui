;(function(){

    //@@include('../bower_components/minified/dist/minified.js')
    var MINI = require('minified');
    var $ = MINI.$, EE = MINI.EE, HTML = MINI.HTML;

    $(function(){

        var snifferElement = $('#jdbc-sniffer');
        var sqlQueries = snifferElement.get('%sql-queries');
        var requestId = snifferElement.get('%request-id');
        var snifferScriptSrc = snifferElement.get('@src');

        var baseUrl = snifferScriptSrc.substring(0, snifferScriptSrc.lastIndexOf('/') + 1);

        // inject stylesheet
        var snifferStyleHref = baseUrl + 'jdbcsniffer.css';
        $('head').add(EE('link', {
            '@rel' : 'stylesheet',
            '@type' : 'text.css',
            '@href' : snifferStyleHref,
            '@media' : 'all'
        }));

        // create main GUI
        var queryList = HTML(
            '//@@include("../dist/jdbcsniffer.html")'
        );

        $('body').add(queryList);
        var toggle = queryList.toggle({'$display': 'none'}, {'$display': 'block'});
        $('button.close', queryList).on('click', toggle);

        // append toolbar
        var queryCounterDiv = EE('div', { 'className' : 'jdbc-sniffer-query-count' }, sqlQueries);
        queryCounterDiv.on('click', toggle);
        $('body').add(queryCounterDiv);

        // create global object
        window.jdbcSniffer = {
            numberOfSqlQueries : parseInt(sqlQueries)
        };

        // request data
        $.request('get', baseUrl + 'request/' + requestId)
            .then(function (data, xhr) {
                var statementsTableBody = EE('tbody');
                if (xhr.status === 200) {
                    var statements = $.parseJSON(data);
                    for (var i = 0; i < statements.length; i++) {
                        var statement = statements[i];
                        statementsTableBody.add(EE('tr',[
                            EE('td',statement.query),
                            EE('td',statement.time)
                        ]));
                    }
                } else if (xhr.status === 204) {
                    statementsTableBody.add(EE('tr',[
                            EE('td','No queries'),
                            EE('td','')
                        ]));
                }
                $('#jdbc-sniffer-queries').add(statementsTableBody);
            })
            .error(function (status, statusText, responseText) {
                console.log(status + ' ' + statusText + ' ' + responseText);
            });

    });

}());