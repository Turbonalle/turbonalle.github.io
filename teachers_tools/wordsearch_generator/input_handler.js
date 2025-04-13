//------------------------------------------------------------------------------
//	Validation
//------------------------------------------------------------------------------

function validateCols() {
	const colsInput = document.getElementById('input-columns');
	const colsError = document.getElementById('columns-error');
	const value = colsInput.value;

	if (!value || isNaN(value) || value <= 0 || value > 16) {
		colsInput.classList.add("input-error");
		colsError.textContent = "Please enter a number between 1 and 16.";
		return false;
	}

	colsInput.classList.remove("input-error");
	colsError.textContent = "";
	return true;
}

//------------------------------------------------------------------------------

function validateRows() {
	const rowsInput = document.getElementById('input-rows');
	const rowsError = document.getElementById('rows-error');
	const value = rowsInput.value;

	if (!value || isNaN(value) || value <= 0 || value > 16) {
		rowsInput.classList.add("input-error");
		rowsError.textContent = "Please enter a number between 1 and 16.";
		return false;
	}

	rowsInput.classList.remove("input-error");
	rowsError.textContent = "";
	return true;
}

//------------------------------------------------------------------------------

function validateWordInput() {
	const element = document.getElementById('input-words');
	const error = document.getElementById('words-error');
	const regex = /^[A-Za-z\såäöÅÄÖ]+$/;
	const value = element.value;

	if (!value || !regex.test(value)) {
		element.classList.add("input-error");
		error.textContent = "Please enter words separated by spaces.";
		return false;
	}

	element.classList.remove("input-error");
	error.textContent = "";
	return true;
}

//------------------------------------------------------------------------------

function validInput(input) {
	if (input.title === "" ||
		input.cols === 0 ||
		input.rows === 0 ||
		input.language === "" ||
		input.words.length === 0) {
			return false;
	}

	return true;
}


//------------------------------------------------------------------------------
//	Get input values
//------------------------------------------------------------------------------

function getTitle() {
	const titleInput = document.getElementById('input-title');
	const title = titleInput.value.trim();

	return title;
}

//------------------------------------------------------------------------------

function getCols() {
	const colsInput = document.getElementById('input-columns');
	
	const valid = validateCols();
	if (!valid) {
		return 0;
	}

	const cols = parseInt(colsInput.value);
	console.log("Cols: " + colsInput.value);
	console.log("Cols: " + cols);
	return cols;
}

//------------------------------------------------------------------------------

function getRows() {
	const rowsInput = document.getElementById('input-rows');
	
	const valid = validateRows();
	if (!valid) {
		return 0;
	}

	const rows = parseInt(rowsInput.value);
	console.log("Rows: " + rowsInput.value);
	console.log("Rows: " + rows);
	return rows;
}

//------------------------------------------------------------------------------

function getLanguage() {
	const languageInput = document.querySelector('input[name="language"]:checked');
	const language = languageInput.value;
	if (languageInput) {
		console.log("Language: " + language);
	}

	return language;
}

//------------------------------------------------------------------------------

function getWords() {
	const wordsInput = document.getElementById('input-words');
	const wordsText = validateWordInput(wordsInput);
	let words = [];
	if (wordsText) {
		words = wordsInput.value
			.split(/\s+/)
			.map(word => word.trim()
				.replace(/[^a-zA-ZåäöÅÄÖ]/g, '')
				.toUpperCase());
		for (let word of words) {
			console.log("Word: \"" + word + "\"");
		}
	}

	return words;
}


//------------------------------------------------------------------------------
//	Submit
//------------------------------------------------------------------------------

function submitForm() {

	let input = {
		title: "",
		cols: 0,
		rows: 0,
		language: "",
		diagonal: false,
		reverse: false,
		overlap: false,
		words: []
	};

	console.log("input: ", input);

	input.title = getTitle();
	input.cols = getCols();
	input.rows = getRows();
	input.language = getLanguage();
	input.diagonal = document.getElementById('diagonal').checked;
	input.reverse = document.getElementById('reverse').checked;
	input.overlap = document.getElementById('overlap').checked;
	input.words = getWords();

	console.log("input: ", input);

	if (!validInput(input)) {
		console.log("Invalid input!");
		return;
	}

	generateWordSearch(input);
}


//------------------------------------------------------------------------------
//	Initialize
//------------------------------------------------------------------------------

function addEventListeners() {
	// Listen for form submission
	document.getElementById('wordSearchForm').addEventListener('submit', function(event) {
		event.preventDefault(); // Prevent default form submission so we can handle it with JS
		submitForm();
	});

	// Get elements
	const colsInput = document.getElementById('input-columns');
	const rowsInput = document.getElementById('input-rows');
	const wordInput = document.getElementById('input-words');

	// Validate on input
	colsInput.addEventListener('input', validateCols);
	rowsInput.addEventListener('input', validateRows);
	wordInput.addEventListener('input', validateWordInput);
	
	// Validate on blur
	colsInput.addEventListener('blur', validateCols);
	rowsInput.addEventListener('blur', validateRows);
	wordInput.addEventListener('blur', validateWordInput);
}

//------------------------------------------------------------------------------

addEventListeners();