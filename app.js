const express = require('express');

const app = express();
app.get('/', (req, res) => {
    res.send('Welcome to the Book Category API');
});

app.get('/categories', (req, res) => {
    res.json([
        { id: 1, name: 'Fiction' },
        { id: 2, name: 'Non-Fiction' },
        { id: 3, name: 'Biography' }
    ]);
});

// Your new route
app.get('/about', (req, res) => {
    res.send('I am a student learning backend development.');
});

// Keep app.listen at the bottom
app.listen(3000, () => {
    console.log('Listening on port 3000');
});