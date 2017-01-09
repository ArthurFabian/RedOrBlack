// Engine is a 2D game engine for HTML5 Canvas.
//
// Arthur Fabian
// http://arthurfabian.com/
//
// Originally written for RedOrBlack - http://redorblack.site/

var Engine = {}

// Factories & Objects

Engine.newSprite = (image, width=image.width, height=image.height, origin= null) => {
	if(origin === null) {
		origin = {x: width/2, y: height/2};
	}

	var sprite = {
		image : image,
		width : width,
		height : height,
		origin : origin
	};

	return sprite;
};

Engine.newScene = () => {
	var scene = {};

	scene.gameObjects = [];

	scene.place = (obj,x=0,y=0) => {
		if(typeof obj.sprite === "undefined") {
			// Assume "obj" is a sprite or image
			obj = e.newGameObject(obj,x,y);
		}
		scene.gameObjects.push(obj);
		return obj;
	};

	scene.remove = (obj) => {
		var indy = scene.gameObjects.indexOf(obj);
		if(indy > -1)
			scene.gameObjects.splice(indy,1);
		else
			console.log("Couldn't remove unlisted game object.");
	};

	scene.origin = {x: 0, y: 0};
	
	scene.main = () => {};

	scene.onclick = (event) => { return event; };
	
	return scene;
};

Engine.newGameObject = (sprite,x,y) => {
	var gameObject = {
		x: x,
		y: y
	};

	gameObject.setSprite = (sprite) => {
		if(typeof sprite.origin !== "object") {
			// Assume "sprite" is an image
			sprite = Engine.newSprite(sprite);
		}
		gameObject.sprite = sprite;
	};

	gameObject.setSprite(sprite);

	gameObject.setPosition = (newPos) => {
		gameObject.x = newPos.x;
		gameObject.y = newPos.y;
	};

	gameObject.getBoundingRect = () => {
		var rect = {};

		rect.right = 	gameObject.x - gameObject.sprite.origin.x + gameObject.sprite.image.width;
		rect.left = 	gameObject.x - gameObject.sprite.origin.x;
		rect.top = 		gameObject.y - gameObject.sprite.origin.y;
		rect.bottom = 	gameObject.y - gameObject.sprite.origin.y + gameObject.sprite.image.height;

		return rect;
	};

	
	gameObject.contains = (pos) => {
		var rect = gameObject.getBoundingRect();

		return pos.x > rect.left && pos.x < rect.right
			&& pos.y < rect.bottom && pos.y > rect.top;
	};

	return gameObject;
};



Engine.newEngine = (canvas) => {
	var e = {};

	e.timestamp = (obj) => {
		obj.t0 = e.t;
		obj.t = () => { return e.t - obj.t0; };
	};

	// Factories & Objects

	e.newSprite = (image, width=image.width, height=image.height, origin= null) => {
		return Engine.newSprite(image, width, height, origin);
	};

	e.newScene = () => {
		var scene = Engine.newScene();

		e.timestamp(scene);
		
		return scene;
	};

	e.newGameObject = (sprite,x,y) => {
		var gameObject = Engine.newGameObject(sprite,x,y);

		e.timestamp(gameObject);

		return gameObject;
	};

	e.canvas = canvas;
	e.t = 0;
	e.dt = 40;

	e.setFPS = (fps) => {
		e.dt = 1000/fps;
	}

	e.schedule = {
		add: (item,time) => {
			if(typeof e.schedule[time] == "undefined") {
				e.schedule[time] = [];
			} else {
				e.schedule[time].push(item);
			}
		}
	};

	e.turn = (advance = 1) => {
		e.t += advance;
		if(typeof e.schedule[e.t] == "function") {

		}
	}

	e.switchTo = (scene) => {
		e.currentScene = scene;
	};

	e.run = () => {
		void function runForever() {
			setTimeout(runForever,e.dt);

			for (var i = 0 ; i < e.currentScene.gameObjects.length ; i++) {
				var g = e.currentScene.gameObjects[i];
				if(typeof g.position == "function") {
					g.setPosition(g.position(g.t()));
				}
			}
			e.currentScene.main();
			e.draw();
			e.turn();
		}();
	};

	// Canvas Interaction

	e.ctx = canvas.getContext("2d");
	e.origin = {x: canvas.width/2, y: canvas.height/2};

	var c = e.canvas;
	var ctx = e.ctx;
	var o = e.origin;

	e.draw = () => {

		ctx.clearRect(0, 0, c.width, c.height);

		var gameObjects = e.currentScene.gameObjects;

		for (var i = 0 ; i < gameObjects.length ; i++) {
			var g = gameObjects[i];
			ctx.drawImage(g.sprite.image, o.x + g.x - g.sprite.origin.x , o.y + g.y - g.sprite.origin.y );
		}
	};

	e.place = (obj) => {
		obj = e.currentScene.place(obj);
		return obj;
	}

	e.onclick = (event) => {
		var cRect = c.getBoundingClientRect();

		myClick = {
			x: event.clientX - cRect.left - e.origin.x,
			y: event.clientY - cRect.top - e.origin.y,
			DOMEvent: event
		};

		return e.currentScene.onclick(myClick);
	}

	canvas.onclick = (event) => e.onclick(event);

	return e;

}
