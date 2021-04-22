/* global AFRAME, THREE */

AFRAME.registerComponent("gesture-handler", {
  schema: {
    enabled: { default: true }
  },

  init: function () {
    this.changeColor = this.changeColor.bind(this);
    this.isVisible = false;

    this.el.sceneEl.addEventListener("markerFound", (e) => {
      this.isVisible = true;
    });

    this.el.sceneEl.addEventListener("markerLost", (e) => {
      this.isVisible = false;
    });
  },

  update: function () {
    if (this.data.enabled) {
      this.el.sceneEl.addEventListener("onefingermove", this.changeColor);
    } else {
      this.el.sceneEl.removeEventListener("onefingermove", this.changeColor);
    }
  },

  remove: function () {
    this.el.sceneEl.removeEventListener("onefingermove", this.changeColor);
  },

  changeColor: function (event) {
    if (this.isVisible) {
      const randomColor = Math.floor(Math.random() * 16777215).toString(16);

      this.redMaterial = new THREE.MeshPhongMaterial({
        color: `#${randomColor}`,
        flatShading: true,
      });

      const object = this.el.getObject3D('mesh');

      const material = this.redMaterial;
      if (object) {
        object.traverse(function (node) {
          if (node.isMesh) node.material = material;
        });
      }
    }
  }
});