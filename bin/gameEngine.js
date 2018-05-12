var debug = require('debug');
var Matter = require('matter-js');

var socketServer;

var gameEngine = {};

var engine = Matter.Engine.create();

gameEngine.init = function(param) {
	socketServer = param;
	socketServer.addEvent(gameEngine.addMaterialRandom);

	// メモリリーク対策
	engine.world.bounds = {
		min : {
			x : 0,
			y : 0
		},
		max : {
			x : 1024,
			y : 1024
		}
	};
};

var ground = Matter.Bodies.rectangle(400, 610, 800, 60, {
	isStatic : true
});
ground.userData = {
	type : 'rect',
	width : 810,
	height : 60
};

Matter.World.add(engine.world, [ ground ]);

var interval;
var fps = 30;

(function() {
	interval = setInterval(function() {
		if (typeof socketServer === 'undefined') {
			return;
		}

		Matter.Events.trigger(engine, 'beforeTick', {
			timestamp : engine.timing.timestamp
		});
		Matter.Events.trigger(engine, 'tick', {
			timestamp : engine.timing.timestamp
		});

		Matter.Engine.update(engine, 1000 / fps);
		var bodies = Matter.Composite.allBodies(engine.world);
		var sendMsg = [];
		bodies.forEach(function(element) {
			var material = {};
			material.id = 'material_' + element.id;
			material.userData = element.userData;
			material.x = element.position.x;
			material.y = element.position.y;
			material.angle = element.angle;
			material.circleRadius = element.circleRadius;
			material.fillStyle = element.render.fillStyle;
			sendMsg.push(material);
		});

		if (bodies.length > 30) {
			for (var i = 0; i < bodies.length; i++) {
				var removBody = bodies[i];
				if (!removBody.isStatic) {
					var removeMateria = {};
					removeMateria.id = 'material_' + removBody.id;
					removeMateria.userData = {
						type : 'remove'
					};
					removeMateria.x = removBody.position.x;
					removeMateria.y = removBody.position.y;
					removeMateria.angle = removBody.angle;
					removeMateria.circleRadius = removBody.circleRadius;
					removeMateria.fillStyle = removBody.render.fillStyle;
					sendMsg.push(removeMateria);
					Matter.Composite.remove(engine.world, removBody);
					break;
				}
			}
		}

		socketServer.sendAll('material', sendMsg);

		Matter.Events.trigger(engine, 'afterTick', {
			timestamp : engine.timing.timestamp
		});

	}, 1000 / fps);
})();

gameEngine.addMaterialRandom = function(obj) {
	if (obj.type !== 'click') {
		return;
	}

	var type = Math.floor(Math.random() * (1 + 1 - 0)) + 0;
	var size = Math.floor(Math.random() * (100 + 1 - 10)) + 10;

	var rBody;

	if (type === 0) {
		rBody = Matter.Bodies.rectangle(obj.x, obj.y, size, size, {
			restitution : 0.7
		});
		rBody.userData = {
			type : 'rect',
			width : size,
			height : size
		};
	} else if (type === 1) {
		rBody = Matter.Bodies.circle(obj.x, obj.y, size, {
			restitution : 0.7
		});
		rBody.userData = {
			type : 'circle'
		};
	}

	Matter.World.add(engine.world, rBody);
};

module.exports = gameEngine;
