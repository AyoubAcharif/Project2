const express = require('express');
const router = express.Router();
const connection = require('../db/db');

router.get('/', function (req, res, next) {
  res.render('Welcome');
  console.log("OK main_page");
});

router.get('/current-scans', function (req, res, next) {
  // Query to retrieve the currentSequence value from the currentSequence table
  connection.query('SELECT idSequence FROM currentSequence', function (err, rows) {
    if (err) throw err;

    if (rows.length > 0) {
      const currentSequence = rows[0].idSequence;

      // Fetch the data from the measures table with the matching idSequence
      connection.query('SELECT idMeasures, length, DATE_FORMAT(DATE_ADD(time, INTERVAL 2 HOUR), "%d/%m/%Y %H:%i:%s") AS time, idSequence FROM measures WHERE idSequence = ? ORDER BY idMeasures DESC LIMIT 1', [currentSequence], function (err, rows) {
        if (err) throw err;
        res.render('index', { title: 'Project 2', measures: rows });
        console.log("OK main page");
      });
    } else {
      res.render('index', { title: 'Project 2', measures: [] }); // Send an empty measures array if no currentSequence is found
    }
  });
});

router.get('/history', function (req, res) {
  console.log("OK history");
  connection.query('SELECT idSequence, idMeasures, length, DATE_FORMAT(DATE_ADD(time, INTERVAL 2 HOUR), "%d/%m/%Y %H:%i:%s") AS time FROM measures WHERE idSequence IS NOT NULL', function (err, rows) {
    if (err) throw err;
    res.render('history', { measures: rows });
  });
});

router.post('/api/reset', function (req, res) {
  // Fetch the maximum idSequence from the measures table
  connection.query('SELECT MAX(idSequence) AS maxId FROM measures', function (err, rows) {
    if (err) throw err;

    const maxId = rows[0].maxId || 0;
    const newSequenceId = maxId + 1;

    // Update the currentSequence table with the new sequence ID
    connection.query('UPDATE currentSequence SET idSequence = ?', [newSequenceId], function (err) {
      if (err) throw err;

      res.json({ success: true, sequenceId: newSequenceId });
    });
  });
});

router.get('/api/data', function (req, res) {
  // Query to retrieve the currentSequence value from the currentSequence table
  connection.query('SELECT idSequence FROM currentSequence', function (err, rows) {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to retrieve currentSequence value' });
      return;
    }

    if (rows.length > 0) {
      const currentSequence = rows[0].idSequence;

      // Query to retrieve the latest measure with the specified currentSequence
      const query = 'SELECT idMeasures, length, DATE_FORMAT(DATE_ADD(time, INTERVAL 2 HOUR), "%d/%m/%Y %H:%i:%s") AS time, idSequence FROM measures WHERE idSequence = ? ORDER BY idMeasures DESC LIMIT 1';
      connection.query(query, [currentSequence], function (err, rows) {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Failed to retrieve measures data' });
        } else {
          res.send(rows);
        }
      });
    } else {
      res.send([]); // Send an empty response if no currentSequence is found
    }
  });
});

router.post('/api/add-to-favorite', function (req, res) {
  const idMeasures = req.body.idMeasures; // Assuming the ID is sent in the request body

  // Perform the database query to add the measure ID to the favorite table
  const query = 'INSERT INTO favorite (idMeasures) VALUES (?)';
  connection.query(query, [idMeasures], function (err) {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to add measure to favorite table' });
    } else {
      res.status(200).json({ success: true });
    }
  });
});

router.get('/favorite-measures', function (req, res) {
  // Query to retrieve the measures from the "measures" table with matching "idMeasures" from the "favorite" table
  const query = 'SELECT m.idMeasures, m.length, DATE_FORMAT(DATE_ADD(m.time, INTERVAL 2 HOUR), "%d/%m/%Y %H:%i:%s") AS time, m.idSequence ' +
    'FROM measures AS m ' +
    'JOIN favorite AS f ON m.idMeasures = f.idMeasures';

  connection.query(query, function (err, rows) {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to retrieve favorite measures' });
    } else {
      res.render('favorite', { measures: rows });
    }
  });
});



module.exports = router;
