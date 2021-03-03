
var scene, camera, fps_camera, renderer, textureLoader;
var height=600, width=750;
var tileSize = 50;
var bgMap = {"grass": [0,5,11], "road": [1,2,3], "water": [6,7,8,9,10], "truck": [4]};
var currentCars = [], currentLogs = [], currentTruck = [];
var speed = 1;
var carSize = tileSize;
var logSize = tileSize*2;
var truckSize = tileSize*3;
var frog;
var lives = 3;
var frog_needed = speed+1;
var audio = {"bgm": new Audio('audio/bgm.mp3'),
			 "hit": new Audio('audio/carhit.wav'),
			 "drown": new Audio('audio/waterfell.wav'),
			 "jump": new Audio('audio/jump.wav'),
			 "win": new Audio('audio/win.wav'),
			 "play": function(type, loop){if(loop){audio[type].loop = true;}audio[type].play()}
    		};
var fps_on = false;
var currentScore = 0;



function createBackground(){
    var gtexture = textureLoader.load('img/grass.jpg', function() {
        for (var i = 0; i < bgMap.grass.length; i++) {
        	var geometry = new THREE.BoxGeometry(1, 1, 5);
        	var material = new THREE.MeshBasicMaterial({map: gtexture});
			for(var j=0; j<width/tileSize; j++){
				var cube = new THREE.Mesh(geometry, material);
				cube.scale.set(tileSize, tileSize, 10);
				cube.position.set((j*tileSize)+(tileSize/2), (bgMap.grass[i]*tileSize)+(tileSize/2), 0);
				cube.castShadow = true;
				cube.receiveShadow = true;
				scene.add(cube);
			}
        }
    });
    var rtexture = textureLoader.load('img/road.jpg', function() {
        for (var i = 0; i < bgMap.road.length; i++) {
        	var geometry = new THREE.BoxGeometry(1, 1, 5);
        	var material = new THREE.MeshBasicMaterial({map: rtexture});
			for(var j=0; j<width/tileSize; j++){
				var cube = new THREE.Mesh(geometry, material);
				cube.scale.set(tileSize, tileSize, 10);
				cube.position.set((j*tileSize)+(tileSize/2), (bgMap.road[i]*tileSize)+(tileSize/2), 0);
				cube.castShadow = true;
				cube.receiveShadow = true;
				scene.add(cube);
			}
        }
        for (var i = 0; i < bgMap.truck.length; i++) {
        	var geometry = new THREE.BoxGeometry(1, 1, 5);
        	var material = new THREE.MeshBasicMaterial({map: rtexture});
			for(var j=0; j<width/tileSize; j++){
				var cube = new THREE.Mesh(geometry, material);
				cube.scale.set(tileSize, tileSize, 10);
				cube.position.set((j*tileSize)+(tileSize/2), (bgMap.truck[i]*tileSize)+(tileSize/2), 0);
				cube.castShadow = true;
				cube.receiveShadow = true;
				scene.add(cube);
			}
        }
    });
    var wtexture = textureLoader.load('img/water.jpg', function() {
        for (var i = 0; i < bgMap.water.length; i++) {
        	var geometry = new THREE.BoxGeometry(1, 1, 5);
        	var material = new THREE.MeshBasicMaterial({map: wtexture});
			for(var j=0; j<width/tileSize; j++){
				var cube = new THREE.Mesh(geometry, material);
				cube.scale.set(tileSize, tileSize, 10);
				cube.position.set((j*tileSize)+(tileSize/2), (bgMap.water[i]*tileSize)+(tileSize/2), 0);
				cube.castShadow = true;
				cube.receiveShadow = true;
				scene.add(cube);
			}
        }
    });
}

function createFrog(){
    var texture = textureLoader.load('img/frog.png', function() {
    	var geometry = new THREE.BoxGeometry(1, 1, 5);
    	var material = new THREE.MeshBasicMaterial({map: texture});
		var cube = new THREE.Mesh(geometry, material);
		cube.scale.set(tileSize, tileSize, 10);
		cube.position.set(width/2, tileSize/2, 10);
		cube.castShadow = true;
		cube.receiveShadow = true;
		scene.add(cube);
		frog = cube;
    });
}

function isCarPresent(x, y) {
    for(var i=0; i<currentCars.length; i++){
    	var newX= x*tileSize;
        var newY= (y*tileSize)+(tileSize/2);
        var oldX = currentCars[i].position.x - (tileSize/2);
        var oldY = currentCars[i].position.y;
        if(newY != oldY){
        	continue;
        }
        if(oldX+tileSize < newX+1 || oldX+1 > newX+tileSize){
        	continue;
        }
        return true;
    }
    return false;
}

function isLogPresent(x, y) {
    for(var i=0; i<currentLogs.length; i++){
    	var newX= x*(2*tileSize);
        var newY= (y*tileSize)+(tileSize/2);
        var oldX = currentLogs[i].position.x - tileSize;
        var oldY = currentLogs[i].position.y;
        if(newY != oldY){
        	continue;
        }
        if(oldX+(2*tileSize) < newX+1 || oldX+1 > newX+(2*tileSize)){
        	continue;
        }
        return true;
    }
    return false;
}

function isTruckPresent(x, y) {
    for(var i=0; i<currentTruck.length; i++){
    	var newX= x*(3*tileSize);
        var newY= (y*tileSize)+(tileSize/2);
        var oldX = currentTruck[i].position.x - tileSize - (tileSize/2);
        var oldY = currentTruck[i].position.y;
        if(newY != oldY){
        	continue;
        }
        if(oldX+(3*tileSize) < newX+1 || oldX+1 > newX+(3*tileSize)){
        	continue;
        }
        return true;
    }
    return false;
}

function createCars(){
	var texture = textureLoader.load('img/car.png', function() {
        for(var i=0; i<bgMap.road.length; i++){
        	var x = Math.random()*(width/carSize);
        	var count = 0;
	        for (var j=0; j<5; j++) {
	            var y = bgMap.road[i];
	            if(isCarPresent(x,y) || count > 2){
	            	x = Math.random()*(width/carSize);
	            	count = 0;
	            	j--;
	            	continue;
	            }
	            var geometry = new THREE.BoxGeometry(1, 1, 5);
		    	var material = new THREE.MeshBasicMaterial({map: texture});
				var cube = new THREE.Mesh(geometry, material);
	            cube.scale.set(carSize, tileSize, 12);
	            cube.position.set((x*carSize)+(carSize/2), (y*tileSize)+(tileSize/2), 15);
	            cube.castShadow = true;
				cube.receiveShadow = true;
				scene.add(cube);
	            currentCars.push(cube);
	            x = x+1;
	            count++;
        	}
	    }
    });
}

function createLogs(){
	var texture = textureLoader.load('img/log.jpg', function() {
        for(var i=0; i<bgMap.water.length; i++){
        	var x = Math.random()*(width/logSize);
        	var count = 0;
	        for (var j=0; j<3; j++) {
	            var y = bgMap.water[i];
	            if(isLogPresent(x,y) || count > 1){
	            	x = Math.random()*(width/logSize);
	            	count = 0;
	            	j--;
	            	continue;
	            }
	            var geometry = new THREE.BoxGeometry(1, 1, 5);
		    	var material = new THREE.MeshBasicMaterial({map: texture});
				var cube = new THREE.Mesh(geometry, material);
	            cube.scale.set(logSize, tileSize, 10);
	            cube.position.set((x*logSize)+(logSize/2), (y*tileSize)+(tileSize/2), 5);
	            cube.castShadow = true;
				cube.receiveShadow = true;
				scene.add(cube);
	            currentLogs.push(cube);
	            x = x+1;
	            count++;
        	}
	    }
    });
}

function createTruck(){
	var texture = textureLoader.load('img/truck.png', function() {
        for(var i=0; i<bgMap.truck.length; i++){
        	for (var j=0; j<2; j++) {
	        	var x = Math.random()*(width/truckSize);
	            var y = bgMap.truck[i];
	            if(isTruckPresent(x,y)){
	            	j--;
	            	continue;
	            }
	            var geometry = new THREE.BoxGeometry(1, 1, 5);
		    	var material = new THREE.MeshBasicMaterial({map: texture});
				var cube = new THREE.Mesh(geometry, material);
	            cube.scale.set(truckSize, tileSize, 20);
	            cube.position.set((x*truckSize)+(truckSize/2), (y*tileSize)+(tileSize/2), 15);
	            cube.castShadow = true;
				cube.receiveShadow = true;
				scene.add(cube);
	            currentTruck.push(cube);
        	}
	    }
    });
}

function animateCars() {
    for(var i=0; i<currentCars.length; i++){
        var y = (currentCars[i].position.y - tileSize/2)/tileSize;
        if(y%2 == 0){
            currentCars[i].position.x += speed;
            if(currentCars[i].position.x > (width+carSize)){
                currentCars[i].position.x = 0;
            }
        }
        else {
            currentCars[i].position.x -= speed;
            if(currentCars[i].position.x < -carSize){
                currentCars[i].position.x = width-1;
            }
        }
    }
}

function animateLogs() {
	for(var i=0; i<currentLogs.length; i++){
        var y = (currentLogs[i].position.y - tileSize/2)/tileSize;
        if(y%2 == 0){
            currentLogs[i].position.x += speed;
            if(currentLogs[i].position.x > (width+logSize)){
                currentLogs[i].position.x = 0;
            }
        }
        else {
            currentLogs[i].position.x -= speed;
            if(currentLogs[i].position.x < -logSize){
                currentLogs[i].position.x = width-1;
            }
        }
        if(frog.position.y == currentLogs[i].position.y){
        	if(frog.position.x < currentLogs[i].position.x-tileSize || currentLogs[i].position.x+tileSize < frog.position.x){
	        	continue;
	        }
            if(y%2 == 0){
                frog.position.x += speed;
	    		if(frog.position.x > width-tileSize/2){
	    			frog.position.x -= speed;
	    		}
	    		else{
	    			fps_camera.position.x += speed;
	    		}
            }
            else{
                frog.position.x -= speed;
	    		if(frog.position.x < tileSize/2){
	    			frog.position.x += speed;
	    		}
	    		else{
	    			fps_camera.position.x -= speed;
	    		}
        	}
        }
    }
}

function animateTruck() {
    for(var i=0; i<currentTruck.length; i++){
        currentTruck[i].position.x += (2*speed);
        if(currentTruck[i].position.x > (width+truckSize)){
            currentTruck[i].position.x = 0;
        }
    }
}

function animateCamera(){
	if(!frog){
		return;
	}
	var xDiff = frog.position.x - fps_camera.position.x;
	var yDiff = frog.position.y - (fps_camera.position.y+45);
	fps_camera.position.x += (xDiff/10.0);
	fps_camera.position.y += (yDiff/10.0);
}

function isFrogHit(){
	var frogCurrentRow = (frog.position.y - tileSize/2)/tileSize;
	if(bgMap.grass.indexOf(frogCurrentRow) != -1){
		return false;
	}
	if(bgMap.road.indexOf(frogCurrentRow) != -1){
	    for(var i=0; i<currentCars.length; i++){
	    	var newX= frog.position.x - (tileSize/2);
	        var newY= frog.position.y;
	        var oldX = currentCars[i].position.x - (tileSize/2);
	        var oldY = currentCars[i].position.y;
	        if(newY != oldY){
	        	continue;
	        }
	        if(oldX+tileSize < newX || oldX > newX+tileSize){
	        	continue;
	        }
	        audio.play("hit");
	        return true;
	    }
	}
	if(bgMap.truck.indexOf(frogCurrentRow) != -1){
	    for(var i=0; i<currentTruck.length; i++){
	    	var newX= frog.position.x - (tileSize/2);
	        var newY= frog.position.y;
	        var oldX = currentTruck[i].position.x - tileSize - (tileSize/2);
	        var oldY = currentTruck[i].position.y;
	        if(newY != oldY){
	        	continue;
	        }
	        if(oldX+(3*tileSize) < newX || oldX > newX+tileSize){
	        	continue;
	        }
	        audio.play("hit");
	        return true;
	    }
	}
	if(bgMap.water.indexOf(frogCurrentRow) != -1){
	    var flag = true;
	    for(var i=0; i<currentLogs.length; i++){
	    	var newX= frog.position.x - (tileSize/2);
	        var newY= frog.position.y;
	        var oldX = currentLogs[i].position.x - tileSize;
	        var oldY = currentLogs[i].position.y;
	        if(newY != oldY){
	        	continue;
	        }
	        if(oldX+(2*tileSize) < newX || oldX > newX+(tileSize/2)){
	        	continue;
	        }
	        flag = false;
	    }
	    if(flag){
	    	audio.play("drown");
	    }
	    return flag;
	}
	return false;
}

function isWin(){
	var frogCurrentRow = (frog.position.y - tileSize/2)/tileSize;
	return (frogCurrentRow == 11);
}

function keyPressed(event) {
	var jump = new Audio('audio/jump.wav');
	jump.play();
    switch(event.keyCode){
    	case 87: //UP
    		frog.position.y += tileSize;
    		if(frog.position.y > height){
    			frog.position.y -= tileSize;
    		}
    		break;
    	case 65: //LEFT
    		frog.position.x -= tileSize;
    		if(frog.position.x < 0){
    			frog.position.x += tileSize;
    		}
    		break;
    	case 68: //RIGHT
    		frog.position.x += tileSize;
    		if(frog.position.x > width){
    			frog.position.x -= tileSize;
    		}
    		break;
    	case 83: //DOWN
    		frog.position.y -= tileSize;
    		if(frog.position.y < 0){
    			frog.position.y += tileSize;
    		}
    		break;
    }
}

function switchCamera(){
	fps_on = !fps_on;
}

function incScore(n){
	currentScore += n;
	document.getElementById("score").innerHTML = currentScore;
}

function main(){
	incScore(0);
	audio.play("bgm", true);

	var aspectRatio = width/height;
	scene = new THREE.Scene();
	fps_camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
	fps_camera.position.set(width/2,-20,100);
	fps_camera.rotation.x = Math.PI/3;
	camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
	camera.position.set(width/2, height/2, 418);
    camera.lookAt(new THREE.Vector3(width/2, height/2, 0));
	textureLoader = new THREE.TextureLoader();
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(width, height);
	renderer.shadowMapEnabled = true;
	document.body.appendChild(renderer.domElement);
	
	var light = new THREE.PointLight(0xffffff, 1, 30);
	light.castShadow = true;
	light.shadow.camera.near = 1;
	light.shadow.camera.far = 30;
	light.shadow.bias = 0.01;
    scene.add(light);

	createBackground();
	createFrog();
	createCars();
	createLogs();
	createTruck();
    document.onkeydown = keyPressed;
    document.getElementById("total_lives").innerHTML = lives;
    document.getElementById("lives").innerHTML = lives;
    document.getElementById("level").innerHTML = speed;
    document.getElementById("frog_needed").innerHTML = frog_needed;

	renderLoop();
}

function renderLoop(){
	animationRequest = requestAnimationFrame(renderLoop);
	animateCars();
	animateLogs();
	animateTruck();
	animateCamera();
	if(frog != null && isFrogHit()){
		frog.position.set(width/2, tileSize/2, 10);
		lives--;
		if(lives < 0){
			lives = 0;
		}
		document.getElementById("lives").innerHTML = lives;
		if(lives == 0){
			document.getElementsByTagName("canvas")[0].style["display"] = "none";
		}
	}
	if(frog != null && isWin()){
		incScore(speed);
		audio.play("win");
		frog.position.set(width/2, tileSize/2, 10);
		frog_needed -= 1;
		if(frog_needed == 0){
			speed += 1;
			document.getElementById("level").innerHTML = speed;
			frog_needed = speed+1;
			if(lives < 3){
				lives++;
				document.getElementById("lives").innerHTML = lives;
			}
		}
		document.getElementById("frog_needed").innerHTML = frog_needed;
	}
	if(fps_on){
		renderer.render(scene, fps_camera);
	}
	else{
		renderer.render(scene, camera);
	}
}