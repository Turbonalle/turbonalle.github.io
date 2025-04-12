window.onload = async function() {
	// Check if html2canvas is loaded
	if (typeof html2canvas === 'undefined') {
		console.error("html2canvas is not loaded correctly.");
	} else {
		console.log("html2canvas loaded successfully!");
	}
	
	// Check if jsPDF is loaded
	if (typeof window.jspdf.jsPDF === 'undefined') {
		console.error("jsPDF is not loaded correctly.");
	}
	else {
		console.log("jsPDF loaded successfully!");
	}
};

document.getElementById('downloadBtn').addEventListener('click', function () {
	html2canvas(document.getElementById('preview')).then(function (canvas) {
		console.log("Download button clicked!");
		const imgData = canvas.toDataURL('image/png');
		const doc = new window.jspdf.jsPDF();
		const imgWidth = doc.internal.pageSize.getWidth() - 20;
		const imgHeight = (canvas.height * imgWidth) / canvas.width;
		doc.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
		doc.save('word_search.pdf');
	});
});