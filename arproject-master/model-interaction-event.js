AFRAME.registerComponent('shapeinteractionhandler', {

    init: function() {
        const animatedMarker = document.querySelector("#hiroMarker");
        const aEntity = document.querySelector("#shapes");
        console.log('aEntity:', aEntity)

        // every click, we make our model grow in size :)
        animatedMarker.addEventListener('click', function(ev, target){
            console.log('ev:', ev)
            const intersectedElement = ev && ev.detail && ev.detail.intersectedEl;
            if (aEntity && intersectedElement === aEntity) {
                const scale = aEntity.getAttribute('scale');
                Object.keys(scale).forEach((key) => scale[key] = scale[key] + 1);
                aEntity.setAttribute('scale', scale);
            }
        });
}});