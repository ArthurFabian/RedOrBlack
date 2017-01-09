// rob.js - Red Or Black
// 
// An Arithmetic Game.
//
// Arthur Fabian
// http://arthurfabian.com/

var c = document.getElementById("myCanvas");
var engine = Engine.newEngine(c);
var e = engine;

function rob() { 

	setUp();

	engine.run();

	function setUp() {
		// Title Scene

		var titleScene = e.newScene();
		titleScene.name = "Title";

		engine.switchTo(titleScene);

		var blackDiscs = [];
		var redDiscs = [];

		var bd = document.getElementById("blackDisc");
		var rd = document.getElementById("redDisc");

		for(var i = 0 ; i < 12 ; i++)
		{
			var bo = e.place(bd);
			var ro = e.place(rd);
			blackDiscs.push(bo);
			redDiscs.push(ro);
		}

		titleScene.place(createTitleCanvas());

		titleScene.onclick = (event) => {
			e.switchTo(gamePlayScene);
		};

		titleScene.main = () => {
			for(var i = 0 ; i < 12 ; i++)
			{
				pos = dilate(titleMotion(titleScene.t() + 3*i),80);

				blackDiscs[i].setPosition(pos);
				redDiscs[i].setPosition(rot180(pos));
			}
		};

		// GamePlay Scene

		var gamePlayScene = e.newScene();
		gamePlayScene.name = "GamePlay";

		var mathProblem;
		var mathTextBoxGameObject = gamePlayScene.place(textBox(mathProblem));

		var redBtn = gamePlayScene.place(document.getElementById("redBtn"),-140,0);
		var blackBtn = gamePlayScene.place(document.getElementById("blackBtn"),140,0);

		var gameplay = {
			setState: (newState) => {
				gameplay.presentState = newState;
				if(typeof newState == "function") {
					return newState();
				}
			}
		};

		var gameDiscs = [];

		// gameplay states

		function ask() {
			e.dt = 40;

			mathProblem = createMathProblem();
			
			mathTextBoxGameObject.setSprite(textBox(mathProblem));


		}
		function visualize() {

			var deltaT = 5.0;

			setTimeout(() => { e.dt = 80; },					5000);
			setTimeout(() => { gameplay.setState(reveal); },	5400+12*80*deltaT);
			setTimeout(() => { gameplay.setState(ask); },		15000);

			var aSprite, bSprite;

			if( mathProblem.a > 0 ) {
				aSprite = bd;
			} else {
				aSprite = rd;
			}

			if( mathProblem.operator == '+' ? mathProblem.b > 0 : mathProblem.b < 0 ) {
				bSprite = bd;
			} else {
				bSprite = rd;
			}

			var polynomial = randomPolynomial();

			var visualXfunc = (x) => {
				return -Math.atan((x-130)*(x-130)*polynomial(x)/9720798303.);
			};

			var xScale = c.width/2.8;
			var yScale = c.height/3;

			var numDiscsA = Math.abs(mathProblem.a);
			var numDiscsB = Math.abs(mathProblem.b);

			var minNumDiscs = Math.min(numDiscsA,numDiscsB);

			function animate0(ind,obj,xFactor,numToExplode) { 
				return (t) => {
					var s = t-ind*deltaT;
					var pos = {i: ind};
					pos.x = xScale* visualXfunc(s) * xFactor;
					pos.y = yScale* Math.sin((s)*0.1);

					if( aSprite != bSprite && s >= 130 ) {
						if( ind < numToExplode ) {
							gamePlayScene.remove(obj);
							var explosion = gamePlayScene.place(document.getElementById("explosion"),obj.x,obj.y);
							setTimeout(()=>{ gamePlayScene.remove(explosion); },100);
						}
					}

					return pos;
				};
			}

			function animate1(ind,obj,xFactor,numToExplode) {
				return (t) => {
					var s = t-ind*deltaT*5;
					var pos = {i: ind};
					pos.x = 2*(s-130) * xFactor;
					pos.y = (-100);

					if( aSprite != bSprite && s >= 130 ) {
						if( ind < numToExplode ) {
							gamePlayScene.remove(obj);
							var explosion = gamePlayScene.place(document.getElementById("explosion"),obj.x,obj.y);
							setTimeout(()=>{ gamePlayScene.remove(explosion); },100);
						}
					}

					return pos;
				};
			}

			gameDiscs = [];

			for( var i = 0 ; i < numDiscsA ; i++ ) {
				var as = gamePlayScene.place(aSprite);
				as.posFuns = [ animate0(i,as,1,numDiscsB) , animate1(i,as,1,numDiscsB) ];

				as.position = as.posFuns[visualChoice%as.posFuns.length];

				gameDiscs.push(as);
			}

			for( var i = 0 ; i < numDiscsB ; i++ ) {
				var bs = gamePlayScene.place(bSprite);
				bs.posFuns = [ animate0(i,bs,-1,numDiscsA) , animate1(i,bs,-1,numDiscsA) ];

				bs.position = bs.posFuns[visualChoice%bs.posFuns.length];

				gameDiscs.push(bs);
			}


		}
		function reveal() {

			mathProblem.reveal();

			mathTextBoxGameObject.setSprite(textBox(mathProblem));

			var correctness = userChoice*mathProblem.ans;

			if (correctness > 0) {
				addToScore(1);
			} else if (correctness < 0) {
				addToScore(-1);
			} else {
				addToScore(0);
			}


		}

		gameplay.setState(ask);


		gamePlayScene.main = () => {
			

		};


		var userChoice;
		var userScore = 0;

		var scoreObject = gamePlayScene.place(textBox(userScore),0,-c.height*.45);

		var visualChoice = 0;

		function addToScore (points) { 
			userScore += points; 
			scoreObject.setSprite(textBox(userScore));
		}

		gamePlayScene.onclick = (myClick) => {
			


			if( gameplay.presentState == ask ) {
				if (redBtn.contains(myClick)) {
					userChoice = -1;
					gameplay.setState(visualize);
				}

				if (blackBtn.contains(myClick)) {
					userChoice = 1;
					gameplay.setState(visualize);
				}

		}  else if ( gameplay.presentState == visualize ) {
				visualChoice++;
				for(var i = 0; i < gameDiscs.length; i++) {
					var posFuns = gameDiscs[i].posFuns;

					gameDiscs[i].position = posFuns[visualChoice%posFuns.length];
				}
			}

		};

	}

	// Title Screen Functions

	function createTitleCanvas() {
		var titleCanvas = document.createElement("CANVAS");
		var titleCtx = titleCanvas.getContext("2d");

		titleCtx .font = "30px Arial";
		titleCanvas.width = titleCtx .measureText("RedOrBlack").width;
		titleCanvas.height = 30;


		titleCtx .font = "30px Arial";
		titleCtx .fillStyle = "red";
		titleCtx .fillText("Red", 0, 25); 
		titleCtx .fillStyle = "black";
		titleCtx .fillText("O", titleCtx.measureText("Red").width, 25); 
		titleCtx .fillStyle = "red";
		titleCtx .fillText("r", titleCtx.measureText("RedO").width, 25); 
		titleCtx .fillStyle = "black";
		titleCtx .fillText("Black", titleCtx.measureText("RedOr").width, 25);

		return titleCanvas;
	}

	function titleMotion(time)
	{
		time *= .8;
		return {x:  1.6*Math.cos(2*time*Math.PI/100)
				-2*Math.cos(4*time*Math.PI/100), 
				y:  1.6*Math.sin(2*time*Math.PI/100)
				-2*Math.sin(4*time*Math.PI/100)};
	}

}
