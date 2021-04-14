AFRAME.registerComponent('change-opacity', {
    init: function(){          
        this.el.addEventListener("model-loaded", e =>{
            const modelMesh = this.el.getObject3D('mesh')
            modelMesh.traverse(node => {
                node.material.transparent =  true
                node.material.opacity = 0.5
            })
        })
    },
    remove: function() {
        this.el.removeEventListener('model-loaded', e)
    }
});