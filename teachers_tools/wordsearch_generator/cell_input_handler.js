let selectedCell = null;

document.addEventListener('click', function (e) {
	const isCell = e.target.classList.contains('cell');

	if (!isCell && selectedCell) {
		selectedCell.classList.remove('selected');
		selectedCell = null;
	}
});

// When a cell is clicked
document.getElementById('grid').addEventListener('click', function(e) {
	if (e.target.classList.contains('cell')) {
		// Deselect previous cell
		if (selectedCell) {
			selectedCell.classList.remove('selected');
		}
		// Select new one
		selectedCell = e.target;
		selectedCell.classList.add('selected');

		// Stop event from bubbling to the document click listener
		e.stopPropagation();
	}
});

// When a key is pressed
document.addEventListener('keydown', function(e) {
	if (selectedCell && /^[a-zA-ZåäöÅÄÖ]$/.test(e.key)) {
		selectedCell.textContent = e.key.toUpperCase();
	}
});