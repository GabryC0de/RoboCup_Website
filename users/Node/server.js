const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();

app.use(cors({
    origin: 'http://127.0.0.1:5500', // front-end port
    credentials: true
}));

app.use(express.json()); // Middleware to parse JSON request body

app.post('/save-json', (req, res) => {
    const updatedData = req.body;

    // Convert the JavaScript object back to a JSON string
    const jsonData = JSON.stringify(updatedData, null, 2);

    // Write the updated JSON data to the file
    fs.writeFile('./prova.json', jsonData, 'utf-8', (err) => {
        if (err) {
            console.error('Error saving JSON data:', err);
            res.status(500).send('Failed to save data');
        } else {
            res.status(200).send('Data saved successfully');
        }
    });
});

app.listen(3000, () => {  // Change port to 3000
    console.log('Server running on port 3000');
});