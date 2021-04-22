AFRAME.registerComponent('markerhandler', {
  
    init: function() {
      const marker = document.querySelector('#marker');
      const box = document.querySelector('#box');
      
      let selected = false;
      let origX = 0.0;
      let endX = 0.0;
      let deltaX = 0.0;
      const rotationSpeed = 0.5;
  
      marker.addEventListener('mousedown', function(ev, target) {
        const intersectedElement = ev && ev.detail && ev.detail.intersectedEl;
        if (box && intersectedElement === box) {
          selected = true;
          origX = ev.clientX;
        }
        
        function onMouseMove(ev) {
          if (selected) {
            endX = ev.clientX;
            if (origX && endX) {
              deltaX = origX - endX;
  
              const rotation = box.getAttribute('rotation');
              const newY = rotation.y - deltaX * rotationSpeed; 
              box.setAttribute('rotation', {x: rotation.x, y: newY, z: rotation.z});
            }
            origX = endX;
          }
        }
        
        document.addEventListener('mousemove', onMouseMove);
        
        marker.addEventListener('mouseup', function(ev, target) {
          selected = false;
          document.removeEventListener('mousemove', onMouseMove);
          marker.onmouseup = null;
        });
      }); 
    }
  });
