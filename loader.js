function syncPages() {
	vps = [...document.querySelectorAll('.vertical-page')];
	vp_amount = vps.length;
	// updatePagePositions();
	// updateNavButtons();
	console.log("Syncing pages! vp_amount: ", vp_amount);
}

async function loadComponent(name, file, connectedCallback = null) {
	const res = await fetch(file);
	const html = await res.text();

	customElements.define(name, class extends HTMLElement {
		constructor() {
			super();
			const template = document.createElement("template");
			template.innerHTML = html;
			this.appendChild(template.content.cloneNode(true));
		}

		async connectedCallback() {
			if (connectedCallback) {
				await connectedCallback(this);
			}
		}
	});
}

await loadComponent("section-profile", "components/section-profile.html");

await loadComponent("section-webpages", "components/section-webpages.html", async (element) => {
	const pages = [
		"webpages.html",
		"math-game.html",
		"wordsearch-generator.html",
		"birthday-invitation.html"
	];
	
	const container = element.querySelector(".horizontal-pages-webpages");
	if (!container) {
		console.error("horizontal-pages-webpages element not found");
		return;
	}

	for (const file of pages) {
		const res = await fetch(`components/projects-webpages/${file}`);
		const html = await res.text();
		const template = document.createElement("template");
		template.innerHTML = html;
		container.appendChild(template.content.cloneNode(true));
	}
});

// loadComponent("section-games", "components/section-games.html", async (element) => {
// 	const pages = [
// 		"webpages.html",
// 		"math-game.html",
// 		"wordsearch-generator.html",
// 		"birthday-invitation.html"
// 	];
	
// 	const container = element.querySelector(".horizontal-pages-webpages");
// 	if (!container) {
// 		console.error("horizontal-pages-webpages element not found");
// 		return;
// 	}

// 	for (const file of pages) {
// 		const res = await fetch(`components/projects-webpages/${file}`);
// 		const html = await res.text();
// 		const template = document.createElement("template");
// 		template.innerHTML = html;
// 		container.appendChild(template.content.cloneNode(true));
// 	}
// });

syncPages();