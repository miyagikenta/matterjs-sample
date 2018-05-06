/**
 * http://usejsdoc.org/
 */

var socket;

$(function() {
	socket = io();

	socket.on("material", function(msg) {
		msg.forEach(function(value) {
			addMateria(value);
		});
		stageUpdate();
	});
});

function sendEvent(obj) {
	if (typeof socket !== "undefined") {
		socket.emit("event", obj);
	}
}
