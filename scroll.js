const vc = document.querySelector('.full-page');
const vps = Array.from(document.querySelectorAll('.vertical-page'));
const vp_amount = vps.length;

const scrollAnimationTime = 300;

let isScrolling = false;
let vp_index = 0;

function easeInOutQuad(t) {
	return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function setScrolling(scr) {
	isScrolling = scr;
	if (scr) {
		console.log('Scrolling started');
	} else {
		console.log('Scrolling done.');
	}
}

function resetHorizontalScrollIfNeeded(newIndex) {
	console.log('Global index: ' + vp_index);
	vps.forEach((vp, i) => {
		if (i !== newIndex) {
			const hc = vp.querySelector('.horizontal-pages');
			if (hc && hc.scrollLeft !== 0) {
				hc.scrollLeft = 0;
				console.log(`Reset horizontal scroll for section ${i}`);
			}
		}
	});
}

function updateCurrentVpIndex() {
	const scrollY = vc.scrollTop;
	const sectionHeight = window.innerHeight;
	const newIndex = Math.round(scrollY / sectionHeight);
	const tolerance = 2;

	if (Math.abs(scrollY - sectionHeight * newIndex) < tolerance) {
		resetHorizontalScrollIfNeeded(newIndex);
		vp_index = newIndex;
		console.log('Updated vertical index:', vp_index);
	}
}


//------------------------------------------------------------------------------
//	Horizontal Scroll
//------------------------------------------------------------------------------

function smoothScrollToX(container, targetX, duration) {
	let startX = container.scrollLeft;
	let change = targetX - startX;
	let startTime = performance.now();

	function animateScroll(currentTime) {
		let elapsed = currentTime - startTime;
		let progress = Math.min(elapsed / duration, 1);
		let ease = easeInOutQuad(progress);

		container.scrollLeft = startX + change * ease;

		if (progress < 1) {
			requestAnimationFrame(animateScroll);
		} else {
			setScrolling(false);
		}
	}

	requestAnimationFrame(animateScroll);
}


//------------------------------------------------------------------------------
//	Vertical Scroll
//------------------------------------------------------------------------------

function smoothScrollToY(container, targetY, duration) {
	container.style.scrollSnapType = 'none';
	container.style.scrollBehavior = 'auto';

	let startY = container.scrollTop;
	let change = targetY - startY;
	let startTime = performance.now();

	function animateScroll(currentTime) {
		let elapsed = currentTime - startTime;
		let progress = Math.min(elapsed / duration, 1);
		let ease = easeInOutQuad(progress);
		
		container.scrollTop = startY + change * ease;

		if (progress < 1) {
			requestAnimationFrame(animateScroll);
		} else {
			resetHorizontalScrollIfNeeded(vp_index);
			container.style.scrollSnapType = 'y mandatory';
			setScrolling(false);
		}
	}

	requestAnimationFrame(animateScroll);
}

function wheelScroll(e) {
	e.preventDefault();
	if (isScrolling) {
		return;
	}
	
	if (e.deltaY > 0 && vp_index < vp_amount - 1) {
		vp_index++;
	} else if (e.deltaY < 0 && vp_index > 0) {
		vp_index--;
	} else {
		return;
	}

	setScrolling(true);
	smoothScrollToY(vc, vp_index * window.innerHeight, scrollAnimationTime);
}

vc.addEventListener('wheel', wheelScroll, {passive: false});
vc.addEventListener('scroll', updateCurrentVpIndex, {passive: false});