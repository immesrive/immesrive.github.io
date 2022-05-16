import * as THREE from "three";
import { ARUtils, ARPerspectiveCamera, ARView, ARDebug } from 'three.ar.js';
import VRControls from 'three-vrcontrols-module';

var vrDisplay;
var vrFrameData;
var vrControls;
var arView;

var canvas;
var camera;
var scene;
var renderer;
var raycaster;
var portalScene, baseScene, stencilScene;
var lastIntersected;

/**
 * Use the `getARDisplay()` utility to leverage the WebVR API
 * to see if there are any AR-capable WebVR VRDisplays. Returns
 * a valid display if found. Otherwise, display the unsupported
 * browser message.
 */
ARUtils.getARDisplay().then(function ( display ) {
  if ( display ) {
    vrFrameData = new VRFrameData();
    vrDisplay = display;
    init();
  } else {
    THREE.ARUtils.displayUnsupportedMessage();
  }
});

function init() {
  // Turn on the debugging panel
  var arDebug = new ARDebug( vrDisplay );
  document.body.appendChild( arDebug.getElement() );

  // Setup the three.js rendering environment
  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.shadowMap.enabled = true;
  renderer.setPixelRatio( window.devicePixelRatio );
  console.log( 'setRenderer size', window.innerWidth, window.innerHeight );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.autoClear = false;
  canvas = renderer.domElement;
  document.body.appendChild( canvas );

  //initialize scenes 
  portalScene = new THREE.Scene();
  stencilScene = new THREE.Scene();
  baseScene = new THREE.Scene();

  //geometries
  var portalGeometry = new THREE.CircleGeometry( 0.2, 20 );
  var ringGeometry = new THREE.RingGeometry( 0.2, 0.22, 20 );
  
  var boxGeometry = new THREE.BoxGeometry( 0.2,0.2,0.2 );

  // set colorWrite to "true" to see the area/shapes of the stencil test
  var portalMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    // depthWrite: false
  });

  var ringMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    // depthWrite: false
  });

  var boxMaterial = new THREE.MeshPhongMaterial({
    color: 0x6d9eff,
  });

  //set up basic lighting
  var dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
  dirLight.position.set( -1, 1.75, 1 );
  portalScene.add( dirLight );

  var pointLight = new THREE.PointLight( 0xffffff, 1 );
  pointLight.position.set( 0, 1.75, 0 );
  portalScene.add( pointLight );

  //create ground and add to scene
  var groundGeo = new THREE.PlaneBufferGeometry( 100, 100 );
  var groundMat = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x050505 } );
  groundMat.color.setHSL( 0.095, 1, 0.75 );
  var ground = new THREE.Mesh( groundGeo, groundMat );
  ground.rotation.x = -Math.PI/2;
  ground.position.y = -1;
  portalScene.add( ground );

  //create sky sphere and add to scene
  var skyGeo = new THREE.SphereGeometry(100, 25, 25 );
  var sky = new THREE.Mesh( skyGeo, new THREE.MeshBasicMaterial({ color: 0xcfe9ff }) );
  sky.material.side = THREE.DoubleSide;
  portalScene.add( sky );

  //arange portals in circle around the origin for now
  var r = 2;
  var theta = 0;
  for ( theta = 0; theta < 2 * Math.PI; theta += 0.6 ) {
    //add portal to scene
    var portalNormal = new THREE.Vector3( 0, 0, 1 );
    var portal = new THREE.Mesh( portalGeometry, portalMaterial );
    portal.position.x = r * Math.cos( theta );
    portal.position.z = r * Math.sin( theta );
    portal.position.y = 0.5;

    portal.rotateY( theta );
    portal.customID = theta;
    stencilScene.add( portal );

    //add portal ring in the same position 
    var ring = new THREE.Mesh( ringGeometry, ringMaterial );
    ring.position.x = r * Math.cos( theta );
    ring.position.z = r * Math.sin( theta );
    ring.position.y = 0.5;

    ring.rotateY( theta );

    baseScene.add( ring)    

    //add target box in front of the portal
    var box = new THREE.Mesh( boxGeometry, boxMaterial );
    box.position.y = 0.5;
    
    var boxNormal = new THREE.Vector3( 0, 0, 1 );
    var yAxis = new THREE.Vector3( 0, 1, 0 );
    boxNormal.applyAxisAngle( yAxis, theta).multiplyScalar( 0.4 );
	  var newBoxPos = new THREE.Vector3().subVectors( ring.position, boxNormal );

    box.position.set( newBoxPos.x, newBoxPos.y, newBoxPos.z );
    box.name = "cube";
    box.customID = theta;
    portalScene.add( box );
  }

  // Creating the ARView, which is the object that handles
  // the rendering of the camera stream behind the three.js
  // scene
  arView = new ARView( vrDisplay, renderer );

  // The ARPerspectiveCamera is very similar to THREE.PerspectiveCamera,
  // except when using an AR-capable browser, the camera uses
  // the projection matrix provided from the device, so that the
  // perspective camera's depth planes and field of view matches
  // the physical camera on the device.
  camera = new ARPerspectiveCamera(
    vrDisplay,
    60,
    window.innerWidth / window.innerHeight,
    vrDisplay.depthNear,
    vrDisplay.depthFar
  );

  // VRControls is a utility from three.js that applies the device's
  // orientation/position to the perspective camera, keeping our
  // real world and virtual world in sync.
  vrControls = new VRControls( camera );

  //Raycasting
  raycaster = new THREE.Raycaster();


  // Bind our event handlers
  window.addEventListener( 'resize', onWindowResize, false );

  update();
}

/**
 * The render loop, called once per frame. Handles updating
 * our scene and rendering.
 */
function update() {
  //Get Raycasting data
  var origin = new THREE.Vector3();
  var direction = new THREE.Vector3();
  camera.getWorldDirection(direction);
  camera.getWorldPosition(origin);
  raycaster.set( origin, direction );
  var intersectsPortalScene = raycaster.intersectObjects( portalScene.children );
  var intersectsStencilScene = raycaster.intersectObjects( stencilScene.children );

  if (intersectsPortalScene.length > 0) {
      // if the closest object lastIntersected is not the currently stored intersection object
      if (intersectsPortalScene[0].object != lastIntersected) {
        // restore previous intersection object (if it exists) to its original color
        if (lastIntersected){
          if (lastIntersected.name == "cube" ){
            //restore blue color
            lastIntersected.material.color.setHex ( 0x6d9eff );
          }
        }
        // store reference to closest object as current intersection object
        lastIntersected = intersectsPortalScene[0].object;
        if (lastIntersected.name == "cube" ){
          //give new red color only if the correct portal also was intersected
          if ( intersectsStencilScene.length > 0 ){
            if ( intersectsStencilScene[0].object.customID == lastIntersected.customID){
              lastIntersected.material.color.setHex ( 0xff00ff );            
            }
          }
        }
      
      }
  } else // there are no intersections
  {
    // restore previous intersection object (if it exists) to its original color
    if (lastIntersected && lastIntersected.name == "cube"){
        lastIntersected.material.color.setHex ( 0x6d9eff );
    }

    // remove previous intersection object reference
    //     by setting current intersection object to "nothing"
    lastIntersected = null;
  }



  // Clears color from the frame before rendering the camera (arView) or scene.
  renderer.clearColor();

  // Render the device's camera stream on screen first of all.
  // It allows to get the right pose synchronized with the right frame.
  arView.render();

  // Update our camera projection matrix in the event that
  // the near or far planes have updated
  camera.updateProjectionMatrix();

  // From the WebVR API, populate `vrFrameData` with
  // updated information for the frame
  vrDisplay.getFrameData( vrFrameData );

  // Update our perspective camera's positioning
  vrControls.update();

  // Render our three.js virtual scene
  renderer.clearDepth();

  var gl = renderer.context;

  // enable stencil test
  gl.enable( gl.STENCIL_TEST );
  //renderer.state.setStencilTest( true );
  gl.depthMask(false);
	gl.disable(gl.DEPTH_TEST);
  // config the stencil buffer to collect data for testing
  gl.stencilFunc( gl.ALWAYS, 1, 0xff );
  gl.stencilOp( gl.REPLACE, gl.REPLACE, gl.REPLACE );

  // render shape for stencil test
  renderer.render( stencilScene, camera );

  //turn depth back on for rendering the actual scene
  gl.depthMask(true);
	gl.enable(gl.DEPTH_TEST);
  // set stencil buffer for testing
  gl.stencilFunc( gl.EQUAL, 1, 0xff );
  gl.stencilOp( gl.KEEP, gl.KEEP, gl.KEEP );
  // render actual scene
  renderer.render( portalScene, camera );
  // disable stencil test
  gl.disable( gl.STENCIL_TEST );
  
  //clear depth before rendering the base scene
  renderer.clearDepth();
  //render just depth information from the portal planes
  gl.colorMask(false, false, false, false);
  renderer.render( stencilScene, camera );
  //now render the base scene
  gl.colorMask(true, true, true, true);
  renderer.render( baseScene, camera );

  // Kick off the requestAnimationFrame to call this function
  // when a new VRDisplay frame is rendered
  vrDisplay.requestAnimationFrame( update );
}

/**
 * On window resize, update the perspective camera's aspect ratio,
 * and call `updateProjectionMatrix` so that we can get the latest
 * projection matrix provided from the device
 */
function onWindowResize () {
  console.log( 'setRenderer size', window.innerWidth, window.innerHeight );
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}
