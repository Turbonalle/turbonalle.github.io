function getCellElement(row, col) {
	return document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
}

//------------------------------------------------------------------------------

function getRandomColor(alpha = 1) {
	const max = 240;
	const min = 40;
	const r = Math.floor(Math.random() * (max - min + 1)) + min;
	const g = Math.floor(Math.random() * (max - min + 1)) + min;
	const b = Math.floor(Math.random() * (max - min + 1)) + min;
	return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

//------------------------------------------------------------------------------

function togglePlacedWords(show) {
	const svg = document.getElementById("word-overlay");
	svg.innerHTML = "";

	if (!show) return;

	for (const word of placedWords) {
		const startCell = getCellElement(word.row, word.col);
		const endCell = getCellElement(
			word.row + word.y * (word.word.length - 1),
			word.col + word.x * (word.word.length - 1)
		);

		const startRect = startCell.getBoundingClientRect();
		const endRect = endCell.getBoundingClientRect();
		const gridRect = document.getElementById("grid").getBoundingClientRect();

		// Convert to coordinates relative to the SVG container
		const startX = startRect.left + startRect.width / 2 - gridRect.left;
		const startY = startRect.top + startRect.height / 2 - gridRect.top;
		const endX = endRect.left + endRect.width / 2 - gridRect.left;
		const endY = endRect.top + endRect.height / 2 - gridRect.top;

		const color = getRandomColor(0.4);

		// Create a nice rounded thick line
		const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
		line.setAttribute("x1", startX);
		line.setAttribute("y1", startY);
		line.setAttribute("x2", endX);
		line.setAttribute("y2", endY);
		line.setAttribute("stroke", color);
		line.setAttribute("stroke-width", 14);
		line.setAttribute("stroke-linecap", "round");

		svg.appendChild(line);
	}
}

//------------------------------------------------------------------------------

document.getElementById('show-words').addEventListener("change", function () {
	togglePlacedWords(this.checked);
});