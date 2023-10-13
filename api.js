const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

// API endpoint for calculating rewards
app.get('/calculate_rewards', (req, res) => {
  // Connect to the SQLite database
  const db = new sqlite3.Database('your_database.db');

  // SQL query to calculate rewards
  const query = `
    SELECT employee_id,
           SUM(CASE WHEN contribution_amount > 100 THEN contribution_amount * 0.1 ELSE 0 END) as reward
    FROM donations
    GROUP BY employee_id
  `;

  db.all(query, [], (err, results) => {
    if (err) {
      throw err;
    }

    // Convert results to JSON format and send as a response
    const rewards = results.reduce((acc, { employee_id, reward }) => {
      acc[employee_id] = reward;
      return acc;
    }, {});

    res.json(rewards);
  });

  // Close the database connection
  db.close();
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});