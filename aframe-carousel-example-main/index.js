// global AFRAME

AFRAME.registerComponent('normalize-size', {
	schema: {
		default: 1
	},
	init() {
	  this.el.addEventListener('model-loaded', () => this.update());
	},
	update() {
		const bbox = new THREE.Box3().setFromObject(this.el.object3D);
		let maxD = 0;
		const scale = this.data;
		for (const d of ['x','y','z']) {
			maxD = Math.max(maxD, bbox.max[d] - bbox.min[d]);
		}
		if (isFinite(maxD) && maxD > 0) {
			this.el.setAttribute('scale', `${scale/maxD} ${scale/maxD} ${scale/maxD}`);
		}
	}
});

window.addEventListener('DOMContentLoaded', function () {
	const lazySusan = document.getElementById('lazy-susan');
	const carouselEl = document.getElementById('carousel-items');
	const carouselItems = Array.from(carouselEl.children).reverse();
	let currentIndex = 0;

	if (document.location.hash) {
		const currentTarget = document.querySelector(document.location.hash);
		if (currentTarget && currentTarget.parentElement === carouselEl) {
			currentIndex = carouselItems.indexOf(currentTarget);
		}
		lazySusan.setAttribute('rotation', `0 ${ currentIndex * lazySusan.dataset.rotateBy } 0`);
	}

	function rotateLazySusan(angle) {
		const oldAngle = lazySusan.getAttribute('rotation').y;
		lazySusan.setAttribute('animation', `property:object3D.rotation.y;from:${oldAngle};to:${angle};`);
	}
	function updateCarouselItem() {
		const currentItem = carouselItems[currentIndex % carouselItems.length];
		window.location.hash = '#' + currentItem.id;
	}
	document.getElementById('prev-slide').addEventListener('click', function () {
		--currentIndex;
		rotateLazySusan(currentIndex * lazySusan.dataset.rotateBy);
		updateCarouselItem();
	});
	document.getElementById('next-slide').addEventListener('click', function () {
		++currentIndex;
		rotateLazySusan(currentIndex * lazySusan.dataset.rotateBy);
		updateCarouselItem();
	});
});
