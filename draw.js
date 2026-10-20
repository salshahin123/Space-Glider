// draws asteroids, ship
let closeby = {"id" : null};

function getNearbyAsteroids(radiusInCells) {
  const ix0 = Math.floor(ship.x / CELL_SIZE);
  const iy0 = Math.floor(ship.y / CELL_SIZE);
  const iz0 = Math.floor(ship.z / CELL_SIZE);

  const nearby = [];
  for (let dx = -radiusInCells; dx <= radiusInCells; dx++) {
    for (let dy = -radiusInCells; dy <= radiusInCells; dy++) {
      for (let dz = -radiusInCells; dz <= radiusInCells; dz++) {
        const key = `${ix0 + dx},${iy0 + dy},${iz0 + dz}`;
        const cellAsteroids = asteroidCells.get(key);
        if (cellAsteroids) nearby.push(...cellAsteroids);
      }
    }
  }
  return nearby;
}

function transformAndProject(wx, wy, wz) {
  // world → camera space using the camera basis
  const dx = wx - ship.x, dy = wy - ship.y, dz = wz - ship.z;
  const cx = dot({x:dx,y:dy,z:dz}, camRight);
  const cy = dot({x:dx,y:dy,z:dz}, camUp);
  const cz = dot({x:dx,y:dy,z:dz}, camForward);

  if (cz <= 1) return null;

  return {
    x: (cx / cz) * FOV + canvas.width / 2,
    y: (cy / cz) * FOV + canvas.height / 2,
    z: cz,
    scale: FOV / cz
  };
}

let nearby = 0;
function drawAsteroids() {

  const vis = [];
  const candidates = getNearbyAsteroids(CELLS_CANDIDATES); // 3-cell radius → tune to taste

  for (let a of candidates) {
    // your existing projection test
    const p = transformAndProject(a.x, a.y, a.z);
    if (!p) continue;

    const r = a.size * p.scale*8;

    if (p.x +r < 0 || p.x -r > canvas.width || p.y +r < 0 || p.y -r > canvas.height) continue;

    vis.push({ p, a });
  }

// you are here

  vis.sort((A, B) => B.p.z - A.p.z);

  for (let {p, a} of vis) {
    const r = a.size * p.scale*8;
    const opacity = 1;
//    const opacity = Math.max(0.1, 1 - p.z / MAX_FRONT);

    fillstyle_number = Math.random();
//    ctx.fillStyle = `rgba(255,255,255,${opacity})`;
/*
    if (fillstyle_number > .75)
      ctx.fillStyle = `rgba(0,255,255,${opacity})`;
    else if (fillstyle_number > .50)
      ctx.fillStyle = `rgba(0,255,0,${opacity})`;
    else if (fillstyle_number > .25)
      ctx.fillStyle = `rgba(255,255,0,${opacity})`;
    else
      ctx.fillStyle = `rgba(255,255,255,${opacity})`;
*/
//
    ctx.fillStyle = `rgba(255,255,255,${opacity})`;
//    ctx.filter = `blur(${Math.min(0.1, p.z )}px)`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
    ctx.strokeStyle = "lightblue"; // Color of the border
    ctx.lineWidth = 1;       // Thickness of the border
    ctx.stroke();
    ctx.fill();

// if asteroid within radius, do this

	let diffx = Math.abs(ship.x-p.x);
	let diffy = Math.abs(ship.y-p.y);
	let diffz = Math.abs(ship.z-p.z);
	let dist = 1000000;

	if (diffx < dist && diffy < dist && diffz < dist){

			nearby+=1
	
	    // 2. Set text properties
	    ctx.font = r/10 + "px Arial";
	    ctx.fillStyle = "black";
	    ctx.textBaseline = "middle"; // Aligns the text vertically to the middle of the y-coordinate
	    ctx.textAlign = "start"; // Aligns the text horizontally to the starting point of the x-coordinate

	    let x= a.x/100000
	    let y= a.y/100000
	    let z= a.z/100000
	    ctx.fillText(a.id + "\n" + x.toFixed(2)  + "\n" + y.toFixed(2)  + "\n" + z.toFixed(2) , 1.1*p.x, 1.1*p.y,);

			// put closest asteroid in visible using sqrt(x^2+y^2+z^2) formula
			// compare this asteroid with visible
			// whichever is less goes in visible

			if (closeby.id == null){
				closeby = a
			}

			let dist_old = Math.sqrt(closeby.x**2 + closeby.y**2 + closeby.z**2)
			let dist_new = Math.sqrt(a.x**2 + a.y**2 + a.z**2)

//			println(dist_new + " " + dist_old )
			if ( dist_new < dist_old ) {
				closeby = a;
				println("closeby is now" + a.id)
//		    nearby += 1
	    }
//	    else
	//    	nearby = Math.max(nearby-1, 0)
    
  } else {
  	nearby -=1
  }
  	nearby = Math.max(nearby, 0)
  ctx.filter = "none";
}
//	println("test")
}

function selectAsteroid() {

	let p = getAsteroid();

	for (const elem of p) {
		print(elem.x);
		print(elem.y);
		print(elem.z);
		print(elem.id);
	}

}
/*
	ctx.fillStyle = `rgba(255,255,255,${opacity})`;
	ctx.filter = `blur(${Math.min(5, p.z / 400)}px)`;
	ctx.beginPath();
	ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
	ctx.strokeStyle = "lightblue"; // Color of the border
	ctx.lineWidth = 1;       // Thickness of the border
	ctx.stroke();
	ctx.fill();
}
*/

function getAsteroid() {
	let size = 1;
	let px = 10;
  const ix0 = Math.floor(ship.x / size);
  const iy0 = Math.floor(ship.y / size);
  const iz0 = Math.floor(ship.z / size);

//  const ix0 = Math.floor(ship.x / size);
//  const iy0 = Math.floor(ship.y / size);
//  const iz0 = Math.floor(ship.z / size);

  const nearby = [];
  for (let dx = -px; dx <= px; dx++) {
    for (let dy = -px; dy <= px; dy++) {
      for (let dz = -px; dz <= px; dz++) {
        const key = `${ix0 + dx},${iy0 + dy},${iz0 + dz}`;
        const cellAsteroids = asteroidCells.get(key);
        if (cellAsteroids) nearby.push(...cellAsteroids);
      }
    }
  }
  return nearby;
}

function drawShipOverlay() {
  const cx = canvas.width/2;
  const cy = canvas.height/2 + 80; // one ship-height lower than center

  ctx.strokeStyle = "red";
  ctx.fillStyle = "rgba(255,0,0,0.5)";
  ctx.beginPath();
  ctx.moveTo(cx + shipOverlay.verts[0].x, cy + shipOverlay.verts[0].y);
  for (let i = 1; i < shipOverlay.verts.length; i++) {
    const v = shipOverlay.verts[i];
    ctx.lineTo(cx + v.x, cy + v.y);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

function drawHUD() {
    ctx.fillStyle = "lime";
    ctx.font = "16px monospace";
    ctx.fillText(`Speed: ${ship.speed.toFixed(1)}`, 10, 20);
    ctx.fillText(`Yaw: ${ship.yaw.toFixed(2)}  Pitch: ${ship.pitch.toFixed(2)}`, 10, 40);

    // Show currently pressed keys
    const pressed = Object.keys(keys).filter(k => keys[k]);
    ctx.fillText(`Keys pressed: ${pressed.join(" ") || "none"}`, 10, 60);

    const d = camForward;
    ctx.fillText(
      `Direction: (${d.x.toFixed(2)}, ${d.y.toFixed(2)}, ${d.z.toFixed(2)})`,
      10, 80
    );

    let slowRate = (ship.speed/500) * Math.sqrt(ship.speed);

		let turning = sensitivity * TURN_RATE;
		
    ctx.fillText(`Turning: ${turning.toFixed(4)}`, 10, 100);
    ctx.fillText(`FOV: ${FOV.toFixed(2)}`, 10, 120);
    ctx.fillText(`holdTime: ${holdTime.toFixed(2)}`, 10, 140);
    ctx.fillText(`MAX_FRONT: ${MAX_FRONT.toFixed(2)}`, 10, 160);
    ctx.fillText(`SLOW_RATE: ${slowRate.toFixed(2)}`, 10, 180);
    ctx.fillText(`x: ${(ship.x/100000).toFixed(2)}`, 10, 200);
    ctx.fillText(`y: ${(ship.y/100000).toFixed(2)}`, 10, 220);
    ctx.fillText(`z: ${(ship.z/100000).toFixed(2)}`, 10, 240);
    ctx.fillText(`nearby: ${nearby}`, 10, 260);
    ctx.fillText(`closeby: ${closeby.id}`, 10, 280);

      // draw log messages under the HUD
  let y = 180;
  for (const line of hudLogs) {
    ctx.fillText(line, 10, y);
    y += 16;
  }
}

function drawMiniMap() {
  // --- config ---
  const mapSize = 150;                 // square minimap size
  const scale = 1 / (BOUNDS * .1);    // how to map (tune this)
  const cx = canvas.width - mapSize - 10; // x offset for top-right
  const cy = 10;                          // y offset for top-right

  // background
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.fillRect(cx, cy, mapSize, mapSize);

  // outline
  ctx.strokeStyle = "lightblue";
  ctx.strokeRect(cx, cy, mapSize, mapSize);

  // center dot = ship
  const centerX = cx + mapSize /2;
  const centerY = cy + mapSize /2;
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
  ctx.fill();

  // basis vectors for lateral (right) and forward (z)
  const forward = camForward;
  const right = camRight;

  // pull only asteroids from nearby cells (radiusInCells tunable)
  const candidates = getNearbyAsteroids(6); // 3 cells around ship

  // for each asteroid candidate
  for (let a of candidates) {
    // position relative to ship
    const dx = a.x - ship.x;
    const dy = a.y - ship.y;
    const dz = a.z - ship.z;

    // optional distance filter for minimap
    const maxRange = Number(window.CELL_SIZE) * 2;
//    const cell_size = window.CELL_SIZE;
//    const maxRange = Math.floor(cell_size)*10;
//    const maxRange = 10000;
    const distSq = dx*dx + dy*dy + dz*dz;
    if (distSq > maxRange * maxRange) continue;

    // project to ship local coordinates
    const lateral = dx * right.x + dy * right.y + dz * right.z;
    const ahead = dx * forward.x + dy * forward.y + dz * forward.z;

    // scale to map coordinates
    const px = centerX + lateral * scale * mapSize;
    const py = centerY - ahead * scale * mapSize; // invert so ahead is up

    // draw only if inside minimap box
    if (px >= cx && px <= cx + mapSize && py >= cy && py <= cy + mapSize) {
      // fade based on distance (optional)
      const dist = Math.sqrt(distSq);
      const alpha = Math.max(0.1, 1 - Math.pow(dist / maxRange, 1));
//    const alpha = 1;
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.fillRect(px, py, 2, 2);
    }
  }
}
