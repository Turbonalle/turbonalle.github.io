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

await loadComponent("section-profile", "components/section-containers/section-profile.html");

await loadComponent("section-webpages", "components/section-containers/section-webpages.html", async (element) => {
	const pages = [
		"webpages.html",
		"math-game.html",
		"wordsearch-generator.html",
		"birthday-invitation.html",
		"wordle-solver.html"
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

await loadComponent("section-games", "components/section-containers/section-games.html", async (element) => {
	const pages = [
		"games.html",
		"oozeheart.html",
		"pong.html",
		"cub3d.html"
	];
	
	const container = element.querySelector(".horizontal-pages-games");
	if (!container) {
		console.error("horizontal-pages-webpages element not found");
		return;
	}

	for (const file of pages) {
		const res = await fetch(`components/projects-games/${file}`);
		const html = await res.text();
		const template = document.createElement("template");
		template.innerHTML = html;
		container.appendChild(template.content.cloneNode(true));
	}
});

await loadComponent("section-projects", "components/section-containers/section-projects.html", async (element) => {
	const pages = [
		"projects.html",
		"discord-bot.html"
	];
	
	const container = element.querySelector(".horizontal-pages-projects");
	if (!container) {
		console.error("horizontal-pages-projects element not found");
		return;
	}

	for (const file of pages) {
		const res = await fetch(`components/projects-other/${file}`);
		const html = await res.text();
		const template = document.createElement("template");
		template.innerHTML = html;
		container.appendChild(template.content.cloneNode(true));
	}
});

await loadComponent("section-info", "components/section-containers/section-info.html");

syncPages();