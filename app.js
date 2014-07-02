var 
	http = require('http'),
	express = require('express'),
	routes = require( './routes' ),
	directory = 'public',
	port = 3000,
	app = express();

server = http.createServer(app);

// server configuration
app.configure( function () {
	app.use( express.bodyParser() );
	app.use( express.methodOverride() );
	app.use( express.static( __dirname + '/public' ) );
	app.use( app.router );
});

app.configure( 'development', function () {
	app.use( express.logger() );
	app.use( express.errorHandler({
	dumpExceptions : true,
	showStack : true
	}) );
});

app.configure( 'production', function () {
	app.use( express.errorHandler() );
});

// this pulls our routes so we don't have to list them all here
//
routes.configRoutes( app, server );

server.listen(port);

console.log(
'Express server listening on port [%d] in [%s] mode',
server.address().port, app.settings.env
);