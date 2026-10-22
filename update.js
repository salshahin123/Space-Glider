// updates values based on user input

function update() {

  const dyaw = TURN_RATE * sensitivity *
    ((keys["ArrowRight"]? 1:0) - (keys["ArrowLeft"]? 1:0));
  const dpitch = -1 * TURN_RATE * sensitivity *
    ((keys["ArrowDown"]? 1:0) - (keys["ArrowUp"]? 1:0));

  const now = performance.now();
  const delta = (now - lastFrameTime)/1000; // seconds
  lastFrameTime = now;

  //if (spacePressed() && keys["ArrowUp"]) {
  if (spacePressed()) {
    if (keys["ArrowUp"]) {

    holdTime += delta;

    if (holdTime < 1) {
      ship.speed += 20 * delta;
      FOV -= zoomSpeed * delta / 10;
      return
    }

    ship.speed += 100 * holdTime; 
    ship.speed = Math.min(ship.speed, targetSpeed);

    sensitivity -= .1;
    sensitivity = Math.max(sensitivity, 1.2);

    if (FOV > targetFOV + .5) FOV -= zoomSpeed * delta;
    if (FOV < targetFOV) FOV = targetFOV;
    FOV = Math.max(targetFOV, FOV)

    } else holdTime = 0;
  }

  // set hold Time to zero upon space and/or up keyup

  if (spacePressed() && keys["ArrowDown"]) {

    holdTime = 0;

    if (ship.speed < 50)
      ship.speed -= 1
    else
      ship.speed -= (ship.speed/250) * Math.sqrt(ship.speed)

    FOV += FOV/35

    sensitivity += .1;
    sensitivity = Math.min(sensitivity, 1.6);

    FOV = Math.min(baseFOV, FOV)  

    ship.speed = Math.max(ship.speed, -50);
  }

  if (spacePressed() && keys["s"]) {
    ship.speed = 0;
//    FOV = baseFOV/2;
  }
    // Turning
  if (!spacePressed()) {

    if (dyaw) {
      // yaw about *local up*
      camForward = rotateAround(camForward, camUp, dyaw);
      camRight   = rotateAround(camRight,   camUp, dyaw);
    }
    if (dpitch) {
      // pitch about *local right*
      camForward = rotateAround(camForward, camRight, dpitch);
      camUp      = rotateAround(camUp,      camRight, dpitch);
    }

    // keep basis orthonormal
    camForward = norm(camForward);
    camRight   = norm(cross(camUp, camForward));
    camUp      = norm(cross(camForward, camRight));

    // keep HUD fields updated (optional)
    ship.pitch = Math.asin(camForward.y);
    ship.yaw   = Math.atan2(camForward.x, camForward.z);
  }

  // Forward drift
  ship.x += camForward.x * ship.speed;
  ship.y += camForward.y * ship.speed;
  ship.z += camForward.z * ship.speed;

  /*
  // change ship overlay based on FOV
  const fovFactor = FOV/baseFOV
  shipOverlay = {
    verts: [
      {x: 0,  y: -10},  // nose
      {x:-205*fovFactor, y:  25},
      {x: 205*fovFactor, y:  25},
    ]
  };
  */

  if (keys["s"]) {
    selectAsteroid();
  }

}

// Rodrigues: rotate vector v around unit axis k by angle a
function rotateAround(v, k, a){
  const c=Math.cos(a), s=Math.sin(a), kv = dot(k,v);
  return {
    x: v.x*c + (k.y*v.z - k.z*v.y)*s + k.x*kv*(1-c),
    y: v.y*c + (k.z*v.x - k.x*v.z)*s + k.y*kv*(1-c),
    z: v.z*c + (k.x*v.y - k.y*v.x)*s + k.z*kv*(1-c),
  };
}

function dot(a,b){ return a.x*b.x + a.y*b.y + a.z*b.z; }
function cross(a,b){ return { x:a.y*b.z - a.z*b.y, y:a.z*b.x - a.x*b.z, z:a.x*b.y - a.y*b.x }; }
function norm(v){ const m=Math.hypot(v.x,v.y,v.z)||1; return { x:v.x/m, y:v.y/m, z:v.z/m }; }

