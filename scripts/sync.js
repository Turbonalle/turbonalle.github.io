function syncDots() {
	webpageProjectDots = document.getElementById("webpageProjectDots");
	if (!webpageProjectDots) return;
	
	[...webpageProjectDots.children].forEach((dot, index) => {
		dot.addEventListener("click", () => jumpToWebpageProject(index));
	});

	gameProjectDots = document.getElementById("gameProjectDots");
	if (!gameProjectDots) return;
	
	[...gameProjectDots.children].forEach((dot, index) => {
		dot.addEventListener("click", () => jumpToGameProject(index));
	});

	otherProjectDots = document.getElementById("otherProjectDots");
	if (!otherProjectDots) return;
	
	[...otherProjectDots.children].forEach((dot, index) => {
		dot.addEventListener("click", () => jumpToOtherProject(index));
	});
}

function bindHorizontalScroll(container) {
	let ticking = false;

	container.addEventListener('scroll', () => {
		if (ticking) return;
		ticking = true;

		requestAnimationFrame(() => {
			const pageIndex = Math.round(container.scrollLeft / container.clientWidth);
			updateDots(container.parentElement, pageIndex);
			ticking = false;
		});
	});
}

function syncPages() {
	vps = [...document.querySelectorAll('.vertical-page')];
	vp_amount = vps.length;

	nav_icons.forEach((icon, i) => {
		icon.addEventListener("click", () => jumpToPage(i));
	});
	syncDots();

	document.querySelectorAll(".horizontal-pages").forEach(bindHorizontalScroll);
}