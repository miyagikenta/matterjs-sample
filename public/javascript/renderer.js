/**
 * http://usejsdoc.org/
 */

var stage;
var materials = {};

$(function() {
	 stage = new createjs.Stage("myCanvas");

	 if(createjs.Touch.isSupported() == true){
		 createjs.Touch.enable(stage);
	 }

	 $("#myCanvas").on("click", function(event){
		if (typeof sendEvent !== "undefined") {
			sendEvent({type:"click", x:event.offsetX, y:event.offsetY});
		}
	 });

	 $("#myCanvas").on("touchend", function(event){
		if (typeof sendEvent !== "undefined") {
			var touchObject = event.changedTouches[0] ;
			var touchX = touchObject.pageX ;
			var touchY = touchObject.pageY ;

			var clientRect = this.getBoundingClientRect() ;
			var positionX = clientRect.left + window.pageXOffset ;
			var positionY = clientRect.top + window.pageYOffset ;

			var x = touchX - positionX ;
			var y = touchY - positionY ;
			sendEvent({type:"click", x:x, y:y});
		}
	 });

	 stage.update();
});

function addMateria(obj) {

	if (typeof stage === "undefined") {
		return;
	}

	var material = materials[obj.id];
	if (typeof material !== "undefined") {
		if(obj.userData.type === "remove"){
			stage.removeChild(material);
			delete materials[obj.id];
			return;
		}
		material.x = 0;
		material.y = 0;
		material.rotation = (obj.angle * 180) / Math.PI ;
		material.x = obj.x;
		material.y = obj.y;
		return;
	}

	var shape = new createjs.Shape();

	shape.graphics.beginFill(obj.fillStyle);

	if (obj.userData.type === "rect") {
		shape.graphics.drawRect(- (obj.userData.width/2), - (obj.userData.height/2), obj.userData.width, obj.userData.height);
		shape.rotation = (obj.angle * 180) / Math.PI ;
		shape.x = obj.x;
		shape.y = obj.y;
	} else if (obj.userData.type === "circle") {
		shape.graphics.drawCircle(0, 0, obj.circleRadius);
		shape.rotation = (obj.angle * 180) / Math.PI ;
		shape.x = obj.x;
		shape.y = obj.y;
	}

	stage.addChild(shape);
	materials[obj.id] = shape;
}

function stageUpdate() {
	if (stage) {
		stage.update();
	}
}
