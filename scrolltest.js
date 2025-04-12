const verticalPages = document.querySelectorAll(".vertical-page");
const projectPages = document.getElementById("page2");
const projectDots = document.getElementById("projectDots");

// Icons
const homeIcon = document.querySelector(".home-icon");
const projectsIcon = document.querySelector(".projects-icon");
const infoIcon = document.querySelector(".info-icon");

// const upButton = document.getElementById("upButton");
// const downButton = document.getElementById("downButton");

let currentPage = 0;
let horizontalIndex = 0;
let isScrolling = false;
const scrollDelay = 200;
let startX = 0;
let isDragging = false;

console.log("vertical pages: " + verticalPages.length);
console.log("horizontal pages: " + projectPages.children.length);


//------------------------------------------------------------------------------
//  Update
//------------------------------------------------------------------------------

function updateHorizontalPage() {
    const middleIndex = (projectPages.children.length - 1) / 2;
    projectPages.style.transform = `translateX(${(middleIndex - horizontalIndex) * 100}vw)`;
}

function updateNavHighlight() {
    document.querySelectorAll(".nav-icon").forEach(icon => icon.classList.remove("active"));

    if (currentPage === 0) {
        document.querySelector(".nav-icon.home-icon").classList.add("active");
    } else if (currentPage === 1) {
        document.querySelector(".nav-icon.projects-icon").classList.add("active");
    } else if (currentPage === 2) {
        document.querySelector(".nav-icon.info-icon").classList.add("active");
    }
}


//------------------------------------------------------------------------------
//  Scroll
//------------------------------------------------------------------------------

function scrollVertically(delta) {
	if (isScrolling) return;

	if (delta > 0 && currentPage < verticalPages.length - 1) {
		currentPage++;
	} else if (delta < 0 && currentPage > 0) {
		currentPage--;
	} else {
		return;
	}
    
	window.scrollTo({
        top: currentPage * window.innerHeight,
		behavior: "smooth"
	});

    updateNavHighlight();

	isScrolling = true;
	setTimeout(() => isScrolling = false, scrollDelay);

    console.log("Current page: " + currentPage);
}

function scrollHorizontally(delta) {    
    // Return if page doesn't have horizontal neighbors
    if (currentPage !== 1) return;

    // Check if we can scroll
    if (delta > 0 && horizontalIndex < projectDots.children.length - 1) {
        horizontalIndex++;
    } else if (delta < 0 && horizontalIndex > 0) {
        horizontalIndex--;
    } else {
        return;
    }

    // Scroll page
    updateHorizontalPage();

    // Remove active from previous dot
    const previousActive = projectDots.querySelector(".dot.active");
    if (previousActive) previousActive.classList.remove("active");

    // Add active to current dot
    projectDots.children[horizontalIndex]?.classList.add("active");

    console.log("Current horizontal page: " + horizontalIndex);
}

function keyHandler(key) {
    if (key === "ArrowDown") {
        scrollVertically(1);
    }
    else if (key === "ArrowUp") {
        scrollVertically(-1);
    }
    else if (key === "ArrowRight") {
        scrollHorizontally(1);
    }
    else if (key === "ArrowLeft") {
        scrollHorizontally(-1);
    }
}


//------------------------------------------------------------------------------
//  Drag-to-Scroll
//------------------------------------------------------------------------------

function startDrag(e) {
    if (currentPage !== 1) return;

    // Check if dragging should be allowed
    // console.log("Attempting to drag: " + e.target.classList);
    // if (!e.target.classList.contains("drag-handle")) {
    //     console.log("Can't drag this element.");
    //     return;
    // }
    // console.log("Dragging allowed!");

    isDragging = true;
    startX = e.touches ? e.touches[0].clientX : e.clientX;
}

function onDrag(e) {
    if (!isDragging) return;
    let currentX = e.touches ? e.touches[0].clientX : e.clientX;
    let deltaX = currentX - startX;

    if (Math.abs(deltaX) > 50) { // Threshold to prevent accidental swipes
        scrollHorizontally(deltaX > 0 ? -1 : 1);
        isDragging = false;
    }
}

function endDrag() {
    isDragging = false;
}


//------------------------------------------------------------------------------
//  Project media
//------------------------------------------------------------------------------

function changeImage(thumbnail)
{
    // Change the main image source
    document.getElementById("main-image").src = thumbnail.src;

    // Remove active class from all thumbnails
    document.querySelectorAll(".thumbnail").forEach(img => img.classList.remove("active"));

    // Add active class to the clicked thumbnail
    thumbnail.classList.add("active");
}


//------------------------------------------------------------------------------
//  Icon and dot pressing
//------------------------------------------------------------------------------

function jumpToPage(page) {
    if (isScrolling) return;
    if (page < 0 || page >= verticalPages.length) return;

    currentPage = page;

    window.scrollTo({
        top: currentPage * window.innerHeight,
        behavior: "smooth"
    });

    updateNavHighlight();

	isScrolling = true;
	setTimeout(() => isScrolling = false, scrollDelay);

    console.log("Current page: " + currentPage);
}

function jumpToProject(index) {
    if (isScrolling) return;
    if (index < 0 || index >= projectDots.children.length) return;

    horizontalIndex = index;

    updateHorizontalPage();

    // Remove active from previous dot
    const previousActive = projectDots.querySelector(".dot.active");
    if (previousActive) previousActive.classList.remove("active");

    // Add active to current dot
    projectDots.children[horizontalIndex]?.classList.add("active");

    console.log("Current horizontal page: " + horizontalIndex);
}


//------------------------------------------------------------------------------
//  Initialize
//------------------------------------------------------------------------------

// Event listeners
document.addEventListener("keydown", (e) => keyHandler(e.key));
window.addEventListener("wheel", (e) => scrollVertically(e.deltaY));

homeIcon.addEventListener("click", () => jumpToPage(0));
projectsIcon.addEventListener("click", () => jumpToPage(1));
infoIcon.addEventListener("click", () => jumpToPage(2));

// add a click event listener for each dot
Array.from(projectDots.children).forEach((dot, index) => {
    dot.addEventListener("click", () => jumpToProject(index));
});

// projectPages.addEventListener("mousedown", startDrag);
// projectPages.addEventListener("mousemove", onDrag);
// projectPages.addEventListener("mouseup", endDrag);
// projectPages.addEventListener("mouseleave", endDrag);
// projectPages.addEventListener("touchstart", startDrag);
// projectPages.addEventListener("touchmove", onDrag);
// projectPages.addEventListener("touchend", endDrag);

// Initialize
updateHorizontalPage();