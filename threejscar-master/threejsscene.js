let carColor = 0xff0000

let scene, camera, renderer;

function init() {

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);

  camera = new THREE.PerspectiveCamera(60,window.innerWidth/window.innerHeight,1,5000);
  camera.rotation.y = 45/180*Math.PI;
  camera.position.x = 900;
  camera.position.y = 100;
  camera.position.z = 600;

  directionalLight = new THREE.DirectionalLight(0xffffff,100);
  directionalLight.position.set(0,1,0);
  directionalLight.castShadow = true;
  scene.add(directionalLight);
  light = new THREE.PointLight(0xc4c4c4,10);
  light.position.set(0,300,500);
  scene.add(light);
  light2 = new THREE.PointLight(0xc4c4c4,10);
  light2.position.set(500,100,0);
  scene.add(light2);

  renderer = new THREE.WebGLRenderer({antialias:true});
  renderer.setSize(1600,1000);

  controls = new THREE.OrbitControls(camera,renderer.domElement);

  document.body.appendChild(renderer.domElement);
  loadScene();
  let loader = new THREE.GLTFLoader();
  let newMaterial = new THREE.MeshStandardMaterial({color: carColor});

  loader.load('scene.gltf', function(gltf){
    car = gltf.scene.children[0];
    car.traverse((o) => {
    if (o.isMesh && o.name == 'Plane045_paint_0') {
      console.log(o.name);
      o.material = newMaterial;
    }
    });
  });
}


function loadScene() {let loader = new THREE.GLTFLoader();
  let newMaterial = new THREE.MeshStandardMaterial({color: carColor});

  loader.load('scene.gltf', function(gltf){
    car = gltf.scene.children[0];
    car.traverse((o) => {
    if (o.isMesh && o.name == 'Plane045_paint_0') {
      console.log(o.name);
      o.material = newMaterial;
    }
    });
    car.scale.set(0.6,0.6,0.6);
    scene.add(gltf.scene);
    animate();
  });}
  function animate() {
    renderer.render(scene,camera);
    requestAnimationFrame(animate);
  }
let yellowButton = document.querySelector('[menu-buttonY]');
let greenButton = document.querySelector('[menu-buttonG]');
let blueButton = document.querySelector('[menu-buttonB]');
yellowButton.addEventListener('click',() => {
carColor = 0xffff00
loadScene();
});
greenButton.addEventListener('click',() => {
carColor = 0x008000
loadScene();
});
blueButton.addEventListener('click',() => {
carColor = 0x0000FF
loadScene();
});
init();