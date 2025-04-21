let placedWords = [];

function clearReview() {
	// Create a blank slate
	let titleDiv = document.getElementById('title');
	let list = document.getElementById('word-list');
	let grid = document.getElementById('grid');
	
	// Clear the title and word list
	titleDiv.innerHTML = "";
	list.innerHTML = "";

	// Remove all the cells from the grid
	const cells = grid.querySelectorAll('.cell');
	cells.forEach(cell => cell.remove());

	// Empty the SVG element
	const svg = document.getElementById('word-overlay');
	if (svg) {
		svg.innerHTML = "";
	} else {
		console.log("SVG element not found");
	}
}

//------------------------------------------------------------------------------

function calculateCellSize(grid, rows, cols) {
	// Create grid
	const sideMargin = 20;
	const gridHeight = grid.offsetHeight;
	const gridWidth = grid.offsetWidth - sideMargin * 2;
	
	console.log("Grid height: " + gridHeight);
	console.log("Grid width: " + gridWidth);
	
	// Temporary cell to get border thickness
	const tempCell = document.createElement('div');
	tempCell.className = 'cell';
	tempCell.style.visibility = 'hidden'; // Hide the temp cell
	document.body.appendChild(tempCell);
	
	const computedStyle = window.getComputedStyle(tempCell);
	const borderThickness = parseFloat(computedStyle.borderWidth);
	
	document.body.removeChild(tempCell); // Clean up
	
	cellSize = Math.floor(Math.min(gridHeight / rows, gridWidth / cols)) - borderThickness;
	console.log("Cell size: " + cellSize);

	return cellSize;
}

//------------------------------------------------------------------------------

function placeWord(cells, word, overlapAllowed) {
	const rows = cells.length;
	const cols = cells[0].length;

	for (let i = 0; i < word.word.length; i++) {
		const newRow = word.row + i * word.y;
		const newCol = word.col + i * word.x;

		if (newRow < 0 || newRow >= rows || newCol < 0 || newCol >= cols) {
			console.log("Out of bounds: " + newRow + ", " + newCol);
			return false; // Out of bounds
		}

		if (overlapAllowed) {
			if (cells[newRow][newCol].textContent !== '' && cells[newRow][newCol].textContent !== word.word[i]) {
				return false;
			}
		} else {
			if (cells[newRow][newCol].textContent !== '') {
				return false;
			}
		}
	}

	for (let i = 0; i < word.word.length; i++) {
		const newRow = word.row + i * word.y;
		const newCol = word.col + i * word.x;
		
		console.log("Placing letter: " + word.word[i] + " at " + newRow + ", " + newCol);
		cells[newRow][newCol].innerHTML = word.word[i];
	}

	return true;
}

//------------------------------------------------------------------------------

function setTitle(title) {
	// Simply set the title in the title div
	let titleDiv = document.getElementById('title');
	titleDiv.innerHTML = title;
}

//------------------------------------------------------------------------------

function setGridStyle(grid, rows, cols, cellSize) {
	// Set up the grid style
    grid.style.gridTemplateColumns = `repeat(${cols}, ${cellSize}px)`;
    grid.style.gridTemplateRows = `repeat(${rows}, ${cellSize}px)`;
}

//------------------------------------------------------------------------------

function createCells(rows, cols, cellSize) {
	let cells = [];
	const fontSize = Math.floor(cellSize * 0.6);
	for (let i = 0; i < rows; i++) {
		cells[i] = [];
		for (let j = 0; j < cols; j++) {
			const cell = document.createElement('div');
			cell.className = 'cell';
			cell.dataset.row = i;
			cell.dataset.col = j;
			grid.appendChild(cell);
			cell.style.height = `${cellSize}px`;
			cell.style.width = `${cellSize}px`;
			cell.style.fontSize = `${fontSize}px`;
			cells[i][j] = cell;
		}
	}
	return cells;
}

//------------------------------------------------------------------------------

const ALL_DIRECTIONS = [
	{ name: 'up',         y: -1, x:  0, diagonal: false, reverse: true },
	{ name: 'down',       y:  1, x:  0, diagonal: false, reverse: false },
	{ name: 'left',       y:  0, x: -1, diagonal: false, reverse: true },
	{ name: 'right',      y:  0, x:  1, diagonal: false, reverse: false },
	{ name: 'up-left',    y: -1, x: -1, diagonal: true,  reverse: true },
	{ name: 'up-right',   y: -1, x:  1, diagonal: true,  reverse: true },
	{ name: 'down-left',  y:  1, x: -1, diagonal: true,  reverse: true },
	{ name: 'down-right', y:  1, x:  1, diagonal: true,  reverse: false },
];

function getValidDirections(allowDiagonal, allowReverse) {
	return ALL_DIRECTIONS
		.map((d, i) => ({ ...d, index: i }))
		.filter(d => {
			if (!allowDiagonal && d.diagonal) return false;
			if (!allowReverse && d.reverse) return false;
			return true;
		});
}

//------------------------------------------------------------------------------

function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
}

//------------------------------------------------------------------------------

function findValidStart(cells, word, direction) {
	const rows = cells.length;
	const cols = cells[0].length;
	const wordLength = word.word.length;

	console.log("Row: " + word.row);
	console.log("Col: " + word.col);

	if (direction.name === "up" || direction.name === "up-left" || direction.name === "up-right") {
		if (word.row < wordLength - 1) {
			word.row = Math.floor(Math.random() * (rows - wordLength)) + (wordLength - 1);
		}
	}

	if (direction.name === "down" || direction.name === "down-left" || direction.name === "down-right") {
		if (word.row > rows - wordLength) {
			word.row = Math.floor(Math.random() * (rows - wordLength));
		}
	}

	if (direction.name === "left" || direction.name === "up-left" || direction.name === "down-left") {
		if (word.col < wordLength - 1) {
			word.col = Math.floor(Math.random() * (cols - wordLength)) + (wordLength - 1);
		}
	}

	if (direction.name === "right" || direction.name === "up-right" || direction.name === "down-right") {
		if (word.col > cols - wordLength) {
			word.col = Math.floor(Math.random() * (cols - wordLength));
		}
	}

	console.log("Row: " + word.row);
	console.log("Col: " + word.col);
	console.log("Dir: " + direction.name);
}

//------------------------------------------------------------------------------

function placeWords(cells, words, rows, cols, validDirections, overlap) {
	console.log("Valid directions: ");
	console.log(validDirections);

	let placedWords = [];
	for (let word of words) {
		let placed = false;
		let startRow = Math.floor(Math.random() * rows);
		for (let testedRows = 0; testedRows < rows && !placed; testedRows++) {
			let row = (startRow + testedRows) % rows;
			let startCol = Math.floor(Math.random() * cols);
			for (let testedCols = 0; testedCols < cols && !placed; testedCols++) {
				let col = (startCol + testedCols) % cols;
				let directions = [...validDirections];
				shuffleArray(directions);
				for (let d of directions) {
					let wordObj = {
						word: word,
						row: row,
						col: col,
						y: d.y,
						x: d.x
					};
					findValidStart(cells, wordObj, d);
					placed = placeWord(cells, wordObj, overlap);
					if (placed) {
						placedWords.push(wordObj);
						break;
					}
				}
			}
		}
		if (!placed) {
			console.log("Could not place word: " + word);
		}
	}
	return placedWords;
}

//------------------------------------------------------------------------------

function fillRestWithRandomLetters(cells, rows, cols, language) {
	let alphabet = "";

	switch (language) {
		case 'swe':
			alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ";
			break;
		case 'fin':
			alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖ";
			break;
		case 'eng':
			alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
			break;
		default:
			alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
			break;
	}

	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			if (cells[i][j].textContent === '') {
				const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
				cells[i][j].textContent = randomLetter;
			}
		}
	}
}

//------------------------------------------------------------------------------

function generateWordList(words) {
	let list = document.getElementById('word-list');
	for (let word of words) {
		const listItem = document.createElement('div');
		listItem.className = 'word-item';
		listItem.textContent = word.word;
		list.appendChild(listItem);
	}
}

//------------------------------------------------------------------------------

function generateWordSearch(input) {
	console.log("Generating word search");

	placedWords = [];
	clearReview();

	setTitle(input.title);

	let grid = document.getElementById('grid');

	const cellSize = calculateCellSize(grid, input.rows, input.cols);

	setGridStyle(grid, input.rows, input.cols, cellSize);

	input.words.sort((a, b) => b.length - a.length);

	let cells = createCells(input.rows, input.cols, cellSize);
	const validDirections = getValidDirections(input.diagonal, input.reverse);
	placedWords = placeWords(cells, input.words, input.rows, input.cols, validDirections, input.overlap);
	fillRestWithRandomLetters(cells, input.rows, input.cols, input.language);

	generateWordList(placedWords);

	// Show words if checkbox is checked
	if (document.getElementById('show-words').checked) {
		togglePlacedWords(true);
	}
}
