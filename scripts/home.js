

function easeInOutQuad(t) {
	return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function updateDots(vp, index) {
	const dots = vp.querySelectorAll(".dot");
	dots.forEach((dot, i) => {
		if (i === index) {
			dot.classList.add("active");
		} else {
			dot.classList.remove("active");
		}
	});
}

function resetHorizontalScrollIfNeeded(newIndex) {
	vps.forEach((vp, i) => {
		if (i !== newIndex) {
			const hc = vp.querySelector('.horizontal-pages');
			if (hc && hc.scrollLeft !== 0) {
				hc.scrollLeft = 0;
				updateDots(vp, 0);
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
	}
}

function updateNavHighlight() {
	nav_icons.forEach((icon, i) => {
		if (i === vp_index) {
			icon.classList.add("active");
		} else {
			icon.classList.remove("active");
		}
	});
}


//------------------------------------------------------------------------------
//	Horizontal Scroll
//------------------------------------------------------------------------------

function smoothScrollToX(container, targetX, duration) {
	container.style.scrollSnapType = 'none';
	container.style.scrollBehavior = 'auto';

	const startX = container.scrollLeft;
	const change = targetX - startX;
	const startTime = performance.now();

	function animateScroll(currentTime) {
		const elapsed = currentTime - startTime;
		const progress = Math.min(elapsed / duration, 1);
		const ease = easeInOutQuad(progress);

		container.scrollLeft = startX + change * ease;

		if (progress < 1) {
			requestAnimationFrame(animateScroll);
		} else {
			container.style.scrollSnapType = 'x mandatory';
			isScrolling = false;
		}
	}

	const pageCount = container.children.length;
	const rawIndex = Math.round(targetX / container.clientWidth);
	const index = Math.max(0, Math.min(rawIndex, pageCount - 1));

	updateDots(container.parentElement, index);
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
			isScrolling = false;
		}
	}

	updateNavHighlight();
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

	isScrolling = true;
	smoothScrollToY(vc, vp_index * window.innerHeight, scrollAnimationTime);
}




//------------------------------------------------------------------------------
//  Icon and dot pressing
//------------------------------------------------------------------------------

function jumpToPage(page) {
    if (isScrolling) return;
    if (page < 0 || page >= vp_amount) return;

    vp_index = page;
	smoothScrollToY(vc, vp_index * window.innerHeight, scrollAnimationTime);
}

function jumpToWebpageProject(index) {
    if (isScrolling) return;
    if (index < 0 || index >= webpageProjectDots.children.length) return;
	
	const hc = vps[1].querySelector(".horizontal-pages");
	if (!hc) {
		console.log("No horizontal container found at vertical index: ", vp_index);
		return;
	}

	updateDots(vps[1], index);
	smoothScrollToX(hc, index * window.innerWidth, scrollAnimationTime);
}

function jumpToGameProject(index) {
    if (isScrolling) return;
    if (index < 0 || index >= gameProjectDots.children.length) return;
	
	const hc = vps[2].querySelector(".horizontal-pages");
	if (!hc) {
		console.log("No horizontal container found at vertical index: ", vp_index);
		return;
	}

	updateDots(vps[2], index);
	smoothScrollToX(hc, index * window.innerWidth, scrollAnimationTime);
}

function jumpToOtherProject(index) {
    if (isScrolling) return;
    if (index < 0 || index >= otherProjectDots.children.length) return;
	
	const hc = vps[3].querySelector(".horizontal-pages");
	if (!hc) {
		console.log("No horizontal container found at vertical index: ", vp_index);
		return;
	}

	updateDots(vps[3], index);
	smoothScrollToX(hc, index * window.innerWidth, scrollAnimationTime);
}


//------------------------------------------------------------------------------
//  Project media
//------------------------------------------------------------------------------

function changePongImage(thumbnail)
{
    // Change the main image source
    document.getElementById("pong-image").src = thumbnail.src;

    // Remove active class from all thumbnails
    document.querySelectorAll(".thumbnail").forEach(img => img.classList.remove("active"));

    // Add active class to the clicked thumbnail
    thumbnail.classList.add("active");
}

function changeCub3dImage(thumbnail)
{
    // Change the main image source
    document.getElementById("cub3d-image").src = thumbnail.src;

    // Remove active class from all thumbnails
    document.querySelectorAll(".thumbnail").forEach(img => img.classList.remove("active"));

    // Add active class to the clicked thumbnail
    thumbnail.classList.add("active");
}


//------------------------------------------------------------------------------
//  Initialize
//------------------------------------------------------------------------------

vc.addEventListener('wheel', wheelScroll, {passive: false});
vc.addEventListener('scroll', updateCurrentVpIndex, {passive: false});