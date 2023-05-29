window.addEventListener('DOMContentLoaded', () => {
  const measureData = document.getElementById('measure-data');
  const resetButton = document.getElementById('reset-button');
  const favoriteIcons = document.getElementsByClassName('favorite-icon');

  let currentSequence = null;

  // Function to handle the reset button click
  function handleReset() {
    fetch('/api/reset', { method: 'POST' })
      .then(response => response.json())
      .then(data => {
        console.log('Reset successful');
        currentSequence = data.sequenceId;
        measureData.innerHTML = '';
      })
      .catch(error => {
        console.log('Error:', error);
      });
  }

  // Function to handle the favorite icon click
  function handleFavoriteClick(event) {
    const measureId = event.target.getAttribute('data-measure');

    fetch('/api/add-to-favorite', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ idMeasures: measureId })
    })
      .then(response => response.json())
      .then(data => {
        console.log('Added to favorites:', data);
      })
      .catch(error => {
        console.log('Error:', error);
      });
  }

  // Function to periodically fetch data from the server
  function fetchData() {
    fetch('/api/data')
      .then(response => response.json())
      .then(data => {
        // Check if the received data is different from the current data
        // and update the table if necessary
        if (data && data.length > 0 && data[0].idMeasures !== currentSequence) {
          currentSequence = data[0].idMeasures;
          measureData.innerHTML = ''; // Clear the existing data

          // Iterate over the new data and append rows to the table
          data.forEach(measure => {
            const row = document.createElement('tr');
            const timeCell = document.createElement('td');
            const sequenceCell = document.createElement('td');
            const idCell = document.createElement('td');
            const lengthCell = document.createElement('td');
            const favoriteCell = document.createElement('td');
            const favoriteIcon = document.createElement('i');

            timeCell.textContent = measure.time;
            sequenceCell.textContent = measure.idSequence;
            idCell.textContent = measure.idMeasures;
            lengthCell.textContent = measure.length;

            favoriteIcon.className = 'fas fa-heart favorite-icon';
            favoriteIcon.setAttribute('data-measure', measure.idMeasures);
            favoriteIcon.addEventListener('click', handleFavoriteClick);

            favoriteCell.appendChild(favoriteIcon);

            row.appendChild(timeCell);
            row.appendChild(sequenceCell);
            row.appendChild(idCell);
            row.appendChild(lengthCell);
            row.appendChild(favoriteCell);

            row.id = 'measure-' + measure.idMeasures;

            measureData.appendChild(row);
          });
        }
      })
      .catch(error => {
        console.log('Error:', error);
      });
  }


  // Attach event listeners
  resetButton.addEventListener('click', handleReset);

  Array.from(favoriteIcons).forEach(icon => {
    icon.addEventListener('click', handleFavoriteClick);
  });

  // Initial data fetch
  fetchData();
  setInterval(fetchData, 1000);
});
