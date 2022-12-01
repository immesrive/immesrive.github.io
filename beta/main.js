import {loadGLTF} from "./libs/loader.js";

const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      filterMinCF: 0.0001 ,
      filterBeta: 0.0001 ,
      container: document.querySelector("#container"),
      imageTargetSrc: './assets/targets/card.mind',
      uiScanning: "#scanning",
      uiLoading: "no",
    });
    const {renderer, scene, camera} = mindarThree;

    const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
    scene.add(light);

    const raccoon = await loadGLTF('./assets/models/Booth.gltf');
    raccoon.scene.scale.set(0.2, 0.2, 0.2);
    raccoon.scene.position.set(0.6,0, 0);

    const anchor = mindarThree.addAnchor(0);
    anchor.group.add(raccoon.scene);

    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  }
  start();
});
