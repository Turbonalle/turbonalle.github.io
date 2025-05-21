let bracket = [];
let rounds = 1;

//------------------------------------------------------------------------------

function createBalancedMatches(names, slots) {
	// Fill matches with empty slots
	let matches = new Array(slots / 2).fill(0).map(() => ["", ""]);

  	// First pass: assign to first position
	let i = 0;
	for (let match of matches) {
		if (i < names.length) {
    		match[0] = names[i++];
    	}
	}

	// Second pass: assign to second position
	for (let match of matches) {
    	if (i < names.length) {
			match[1] = names[i++];
		}
	}

	return matches;
}

//------------------------------------------------------------------------------

function generateBracket() {
	const names = document.getElementById("names").value
		.split("\n")
		.map(n => n.trim())
		.filter(n => n);

	if (names.length < 2) {
		alert("Enter at least two participants.");
		return;
	}

	// Shuffle names
	for (let i = names.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[names[i], names[j]] = [names[j], names[i]];
	}

	// Find next power of 2
	rounds = 1;
	let slots = 2;
	while (slots < names.length)
	{
		slots *= 2;
		rounds++;
	}

	console.log("rounds", rounds);

	bracket = [createBalancedMatches(names, slots)];
	console.log(bracket);
	renderBracket();
}

//------------------------------------------------------------------------------

function renderBracket() {
	const container = document.getElementById("bracket");
	container.innerHTML = "";

	const currentRound = bracket.length;

	bracket.forEach((round, roundIndex) => {
		const roundDiv = document.createElement("div");
		roundDiv.className = "round";

		if (roundIndex === rounds) {
			const champion = round[0][0];
			if (!champion) {
				console.log("No champion yet");
				return;
			}
			const winnerBanner = document.createElement("div");
			winnerBanner.className = "champion-banner";
			winnerBanner.textContent = `🏆 Winner 🏆`;
			winnerBanner.innerHTML += `<h2 class="tournament-winner-name">${champion}</h2>`;
			container.appendChild(winnerBanner);
			return;
		}
		else if (roundIndex === rounds - 1) {
			roundDiv.innerHTML = `<h2>Final</h2>`;
		}
		else if (roundIndex === rounds - 2) {
			roundDiv.innerHTML = `<h2>Semi-Final</h2>`;
		}
		else {
			roundDiv.innerHTML = `<h2>Round ${roundIndex + 1}</h2>`;
		}

		round.forEach((match, matchIndex) => {
			const matchDiv = document.createElement("div");
			matchDiv.className = "match";

			const winnerIndex = match.winnerIndex;

			let name0Class = "name";
			let name1Class = "name";

			if (winnerIndex !== undefined) {
				if (winnerIndex === 0) {
					name0Class += " winner";
					name1Class += " loser";
				} else {
					name0Class += " loser";
					name1Class += " winner";
				}
			}

			matchDiv.innerHTML = `
				<div class="match-layout">
					<div class="left ${name0Class}" onclick="setWinner(${roundIndex}, ${matchIndex}, 0)">${match[0] || ""}</div>
					<div class="vs">vs</div>
					<div class="right ${name1Class}" onclick="setWinner(${roundIndex}, ${matchIndex}, 1)">${match[1] || ""}</div>
				</div>
			`;
			roundDiv.appendChild(matchDiv);
		});

		container.appendChild(roundDiv);
	});
}

//------------------------------------------------------------------------------

function setWinner(roundIndex, matchIndex, winnerIndex) {
	console.log("setWinner", roundIndex, matchIndex, winnerIndex);

	const winner = bracket[roundIndex][matchIndex][winnerIndex];
	if (!winner || winner === "BYE") {
		alert("Can't select a BYE as winner.");
		return;
	}

	// Store the winnerIndex in the match array (add a property)
	bracket[roundIndex][matchIndex].winnerIndex = winnerIndex;
	
	// Propagate the winner to the next round
	const nextRound = bracket[roundIndex + 1] || [];
	const targetMatch = Math.floor(matchIndex / 2);
	if (!nextRound[targetMatch]) {
		nextRound[targetMatch] = ["", ""];
	}
	const slot = matchIndex % 2;
	nextRound[targetMatch][slot] = winner;
	bracket[roundIndex + 1] = nextRound;
		
	renderBracket();
}