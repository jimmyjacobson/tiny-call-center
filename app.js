
var fs = require('fs')

TINY_CONFIG = require('./tiny-config');


/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , recording = require('./routes/recording')
  , http = require('http')
  , path = require('path')
  , hbs = require('hbs');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'hbs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);

//twilio routes
app.get('/twilio/call', routes.call);
app.post('/twilio/option', routes.option);
app.get('/twilio/random-say', routes.randomSay);
app.post('/twilio/recording', recording.created);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
