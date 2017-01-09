
function doOnce (fun) {
	return function() {
		if(typeof this.done == "undefined") {
			fun();
		}
		this.done = true;
	};
}

function rot180 (pos) {
	return {x: -pos.x, y: -pos.y};
}

function dilate (pos, factor) {
	return {x: pos.x * factor, y: pos.y * factor};
}

function hFlip (pos) {
	return {x: -pos.x, y: pos.y};
}


function randomPolynomial(rootMax = 50, numRoots = 4) {
	var roots = [];

	for ( var i = 0 ; i < numRoots ; i++ ) {
		roots.push(rootMax*Math.random());
	}

	return (t) => {
		var val = 1;

		for ( var i = 0 ; i < roots.length ; i++ ) {
			val *= t - roots[i];
		}

		return val;
	};
}


function squeezer(t,iterations=1) {
	for(var i = 0 ; i < iterations ; i++) {
		if(-1 <= t && t <= 1)
			continue;

		if(t > 0) {
			t = 1+Math.log(t);
		} else {
			t =  -1-Math.log(-t);
		}
	}

	return t;
}


function createMathProblem()
{
	var ans = Math.floor(Math.random()*25-12);
	var a = Math.floor(Math.random()*25-12);
	var b = ans - a;
	var operator = null;
	var displayAns = "?";
	if(Math.floor(Math.random()*2))
	{
		operator = '-';
		b = -b;
	}
	else
	{
		operator = '+';
	}
	var mathProblem = {a:a,operator:operator,b:b,ans:ans,displayAns:displayAns};

	mathProblem.toString = () => a+operator+(b<0?"("+b+")":b)+"="+mathProblem.displayAns;
	
	mathProblem.reveal  = function() {
		mathProblem.displayAns = mathProblem.ans;
	}

	return mathProblem;
}

function textBox(text) {
	var canvas = document.createElement("CANVAS");
	var ctx = canvas.getContext("2d");

	ctx .font = "30px Arial";
	canvas.width = ctx.measureText(text).width;
	canvas.height = 30;

	ctx .font = "30px Arial";
	ctx.fillText(text, 0, 25); 

	canvas.ctx = ctx;

	return canvas;
}

