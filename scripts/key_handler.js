function keyHandler(key) {
	console.log("Key pressed: ", key);
	if (isScrolling) return;

    if (key === "ArrowDown") {
		if (vp_index >= vp_amount - 1) return;
		vp_index++;
        smoothScrollToY(vc, vp_index * window.innerHeight, scrollAnimationTime);
    }
    else if (key === "ArrowUp") {
		if (vp_index <= 0) return;
		vp_index--;
        smoothScrollToY(vc, vp_index * window.innerHeight, scrollAnimationTime);
    }
    else if (key === "ArrowRight") {
		const hc = vps[vp_index].querySelector('.horizontal-pages');
		if (!hc || hc.ScrollLeft >= (hc.scrollWidth - hc.clientWidth)) return;
        smoothScrollToX(hc, hc.scrollLeft + window.innerWidth, scrollAnimationTime);
    }
    else if (key === "ArrowLeft") {
        const hc = vps[vp_index].querySelector('.horizontal-pages');
		if (!hc || hc.scrollLeft <= 0) return;
        smoothScrollToX(hc, hc.scrollLeft - window.innerWidth, scrollAnimationTime);
    }
}

document.addEventListener("keydown", (e) => keyHandler(e.key));