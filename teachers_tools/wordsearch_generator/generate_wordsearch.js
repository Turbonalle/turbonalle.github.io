function clearReview() {
	// Create a blank slate
	let titleDiv = document.getElementById('title');
	let grid = document.getElementById('grid');
	let list = document.getElementById('word-list');
	titleDiv.innerHTML = "";
	grid.innerHTML = "";
	list.innerHTML = "";
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

function placeWord(cells, word, startRow, startCol, direction) {
	const rows = cells.length;
	const cols = cells[0].length;
	const wordLength = word.length;

	let row = startRow;
	let col = startCol;

	console.log("Row: " + row);
	console.log("Col: " + col);

	if (direction === 0 || direction === 4 || direction === 5) {
		if (row < wordLength - 1) {
			row = Math.floor(Math.random() * (rows - wordLength)) + (wordLength - 1);
		}
	}

	if (direction === 1 || direction === 6 || direction === 7) {
		if (row > rows - wordLength) {
			row = Math.floor(Math.random() * (rows - wordLength));
		}
	}

	if (direction === 2 || direction === 4 || direction === 6) {
		if (col < wordLength - 1) {
			col = Math.floor(Math.random() * (cols - wordLength)) + (wordLength - 1);
		}
	}

	if (direction === 3 || direction === 5 || direction === 7) {
		if (col > cols - wordLength) {
			col = Math.floor(Math.random() * (cols - wordLength));
		}
	}

	console.log("Row: " + row);
	console.log("Col: " + col);
	console.log("Dir: " + direction);

	// Calculate the direction offsets
	const directions = [
		[-1, 0], // Up
		[1, 0],  // Down
		[0, -1], // Left
		[0, 1],  // Right
		[-1, -1],// Up-Left
		[-1, 1], // Up-Right
		[1, -1], // Down-Left
		[1, 1]   // Down-Right
	];

	const [rowOffset, colOffset] = directions[direction];

	for (let i = 0; i < wordLength; i++) {
		const newRow = row + i * rowOffset;
		const newCol = col + i * colOffset;

		if (newRow < 0 || newRow >= rows || newCol < 0 || newCol >= cols) {
			console.log("Out of bounds: " + newRow + ", " + newCol);
			return false; // Out of bounds
		}
		
		if (cells[newRow][newCol].textContent !== '') {
			console.log("Cell occupied: " + newRow + ", " + newCol);
			return false; // Cell already occupied by a different letter
		}
	}

	for (let i = 0; i < wordLength; i++) {
		const newRow = row + i * rowOffset;
		const newCol = col + i * colOffset;
		
		console.log("Placing letter: " + word[i] + " at " + newRow + ", " + newCol);
		cells[newRow][newCol].innerHTML = word[i];
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

function placeWords(cells, words, rows, cols) {
	// Place the words in the grid
	let placedWords = [];
	for (let word of words) {
		let placed = false;
		let startRow = Math.floor(Math.random() * rows);
		for (let testedRows = 0; testedRows < rows && !placed; testedRows++) {
			let row = (startRow + testedRows) % rows;
			let startCol = Math.floor(Math.random() * cols);
			for (let testedCols = 0; testedCols < cols && !placed; testedCols++) {
				let col = (startCol + testedCols) % cols;
				const originalDirection = Math.floor(Math.random() * 8);
				for (let testedDirections = 0; testedDirections < 8 && !placed; testedDirections++) {
					let direction = (originalDirection + testedDirections) % 8;
					placed = placeWord(cells, word, row, col, direction);
					if (placed) {
						placedWords.push({
							word: word,
							row: row,
							col: col,
							direction: direction
						});
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

	clearReview();
	setTitle(input.title);

	let grid = document.getElementById('grid');

	// const regex = setRegex(language);
	const cellSize = calculateCellSize(grid, input.rows, input.cols);

	setGridStyle(grid, input.rows, input.cols, cellSize);

	input.words.sort((a, b) => b.length - a.length);

	let cells = createCells(input.rows, input.cols, cellSize);
	let placedWords = placeWords(cells, input.words, input.rows, input.cols);
	fillRestWithRandomLetters(cells, input.rows, input.cols, input.language);

	generateWordList(placedWords);
}
