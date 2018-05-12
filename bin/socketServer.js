var debug = require('debug');
var socketio = require('socket.io');

var io;

var socketServer = {};

var eventArray = [];

socketServer.init = function(server) {
	io = socketio.listen(server);

	io.on('connection', function(socket) {
		socket.on('message', function(msg) {
			console.log(msg);
		});

		socket.on('event', function(msg) {
			eventArray.forEach(function(element) {
				element(msg);
			});
		});
	});
};

socketServer.sendAll = function(str, msg) {
	io.emit(str, msg);
};

socketServer.addEvent = function(event) {
	eventArray.push(event);
};

module.exports = socketServer;
