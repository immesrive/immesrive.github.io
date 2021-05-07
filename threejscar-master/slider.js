let slider = document.querySelectorAll('li'), 
    bingkai = document.querySelector('.slider'),
    bodyLeft = document.body.offsetWidth,
    bodyTop = document.body.offsetHeight,
    transition = 300, 
    loop = 1, 
    cek, intId,
    areaSlider = document.querySelector('ul'); 

function totArea() {

  areaSlider.style.width = slider.length * 100 + '%'; 
  areaSlider.style.transition = transition + 'ms ease-in-out';
  bingkai.style.transition = transition + 'ms ease-in';

  cek = () => {
    if (loop === slider.length) loop = 0;
    counter(loop++);
  }

  intId = setInterval(cek, 5000);

  function counter(n) {
    if (n === 0) {
      areaSlider.style.left = -slider[n].offsetLeft + 70 + 'px';
      setTimeout(() => {
        areaSlider.style.left = -slider[n].offsetLeft - 100 + 'px'
      }, (1.02 * transition));
      setTimeout(() => {
        areaSlider.style.left = -slider[n].offsetLeft + 'px'
      }, (1.8 * transition));
    } else {
      areaSlider.style.left = -slider[n].offsetLeft - 70 + 'px';
      setTimeout(() => {
        areaSlider.style.left = -slider[n].offsetLeft + 50 + 'px'
      }, (1.02 * transition));
      setTimeout(() => {
        areaSlider.style.left = -slider[n].offsetLeft + 'px'
      }, (1.8 * transition));
    }

  }
}
totArea();