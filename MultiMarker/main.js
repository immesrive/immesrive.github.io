import {mockWithVideo, mockWithImage} from './libs/camera-mock.js';
import {loadGLTF, loadTexture, loadTextures, loadVideo} from './libs/loader.js';

const capture = (mindarThree) => {
  const {video, renderer, scene, camera} = mindarThree;
  const renderCanvas = renderer.domElement;

  // output canvas
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = renderCanvas.width;
  canvas.height = renderCanvas.height;

  const sx = (video.clientWidth - renderCanvas.clientWidth) / 2 * video.videoWidth / video.clientWidth;
  const sy = (video.clientHeight - renderCanvas.clientHeight) / 2 * video.videoHeight / video.clientHeight;
  const sw = video.videoWidth - sx * 2; 
  const sh = video.videoHeight - sy * 2; 

  context.drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
  
  renderer.preserveDrawingBuffer = true;
  renderer.render(scene, camera); // empty if not run
  context.drawImage(renderCanvas, 0, 0, canvas.width, canvas.height);
  renderer.preserveDrawingBuffer = false;

  const data = canvas.toDataURL('image/png');
  return data;
}
const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.querySelector("#container"),
      imageTargetSrc: './assets/targets/multi.mind',
      maxTrack: 3,

    });
    const {renderer, scene, camera} = mindarThree;

    const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
    scene.add(light);

    const raccoon = await loadGLTF('./assets/models/musicband-raccoon/scene.gltf');
    raccoon.scene.scale.set(0.1, 0.1, 0.1);
    raccoon.scene.position.set(0, -0.4, 0);

    const bear = await loadGLTF('./assets/models/musicband-bear/scene.gltf');
    bear.scene.scale.set(0.1, 0.1, 0.1);
    bear.scene.position.set(0, -0.4, 0);

    const coffee = await loadGLTF('./assets/models/coffee/scene.glb');
    coffee.scene.scale.set(1, 1, 1);
    coffee.scene.position.set(0, -0.4, 0);

    const raccoonAnchor = mindarThree.addAnchor(0);
    raccoonAnchor.group.add(raccoon.scene);

    const bearAnchor = mindarThree.addAnchor(1);
    bearAnchor.group.add(bear.scene);

    const coffeeAnchor = mindarThree.addAnchor(2);
    coffeeAnchor.group.add(coffee.scene);
    
   
   const previewImage = document.querySelector("#preview-image");
   const previewClose = document.querySelector("#preview-close");
   const preview = document.querySelector("#preview");
   const previewShare = document.querySelector("#preview-share");

   document.querySelector("#capture").addEventListener("click", () => {
     const data = capture(mindarThree);
     preview.style.visibility = "visible";
     previewImage.src = data;
   });

   previewClose.addEventListener("click", () => {
     preview.style.visibility = "hidden";
   });

   previewShare.addEventListener("click", () => {
     const canvas = document.createElement('canvas');
     canvas.width = previewImage.width;
     canvas.height = previewImage.height;
     const context = canvas.getContext('2d');
     context.drawImage(previewImage, 0, 0, canvas.width, canvas.height);

     canvas.toBlob((blob) => {
 const file = new File([blob], "photo.jpg", {type: "image/jpg"});
 const files = [file];
 if (navigator.canShare && navigator.canShare({files})) {
   navigator.share({
     files: files,
     title: 'AR Photo',
   })
 } else {
   const link = document.createElement('a');
   link.download = 'photo.jpg';
   link.href = previewImage.src;
   link.click();
 }
     });
   });

    
    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  }
  
  start();
});