// Handle tab switching
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

function switchTab(event) {
    const sequenceId = event.target.getAttribute('data-sequence');

    // Hide all tab contents
    tabContents.forEach(content => {
        content.style.display = 'none';
    });

    // Show the selected tab content
    const selectedTabContent = document.getElementById('tab-' + sequenceId);
    selectedTabContent.style.display = 'block';

    // Toggle active class for tab buttons
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });
    event.target.classList.add('active');
}

// Attach event listeners to tab buttons
tabButtons.forEach(button => {
    button.addEventListener('click', switchTab);
});