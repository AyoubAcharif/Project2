// Handle "All Sequences" button
const allSequencesButton = document.querySelector('.tab-button[data-sequence="all"]');

function showAllSequences() {
    // Show all tab contents
    tabContents.forEach(content => {
        content.style.display = 'block';
    });

    // Toggle active class for tab buttons
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });
    allSequencesButton.classList.add('active');
}

// Attach event listener to "All Sequences" button
allSequencesButton.addEventListener('click', showAllSequences);