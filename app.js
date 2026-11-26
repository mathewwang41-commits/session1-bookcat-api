
const express = require('express');
const sql = require('mssql');

const app = express();

app.use(express.json());

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

app.get('/about', (req, res) => {
    res.send('I am a student learning backend development.');
});


const dbConfig = {
    server: 'localhost',
    port: 1433,
    database: 'NPBookstore',
    user: 'npbookstore_user1',
    password: 'Mathew655B14@%#',
    options: {
        trustServerCertificate: true
    }
};

// GET all authors
app.get('/authors', async (req, res) => {
    let connection;

    try {
        connection = await sql.connect(dbConfig);

        const result = await connection.request()
            .query('SELECT AuthorID, Name FROM Author');

        res.status(200).json(result.recordset);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });

    } finally {
        if (connection) await connection.close();
    }
});

// GET one author
app.get('/authors/:id', async (req, res) => {
    const authorId = parseInt(req.params.id);

    if (isNaN(authorId)) {
        return res.status(400).json({ error: 'Invalid author id' });
    }

    let connection;

    try {
        connection = await sql.connect(dbConfig);

        const request = connection.request();
        request.input('id', authorId);

        const result = await request.query(
            'SELECT AuthorID, Name FROM Author WHERE AuthorID = @id'
        );

        if (result.recordset.length === 0) {
            return res.status(404).json({ error: 'Not found' });
        }

        res.status(200).json(result.recordset[0]);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });

    } finally {
        if (connection) await connection.close();
    }
});


// POST a new author
app.post('/authors', async (req, res) => {
    let connection;

    try {
        connection = await sql.connect(dbConfig);

        const request = connection.request();
        request.input('id', req.body.id);
        request.input('name', req.body.name);

        const result = await request.query(
            'INSERT INTO Author (AuthorID, Name) OUTPUT INSERTED.* VALUES (@id, @name)'
        );

        res.status(201).json(result.recordset[0]);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });

    } finally {
        if (connection) await connection.close();
    }
});

 // PUT (update) an author
app.post('/authors/:id', async (req, res) => {
    let connection;

    try {
        connection = await sql.connect(dbConfig);

        const request = connection.request();
        request.input('id', parseInt(req.params.id));
        request.input('name', req.body.name);

        const result = await request.query(
            'UPDATE Author SET Name = @name WHERE AuthorID = @id'
        );

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ error: 'Not found' });
        }

        res.json({ id: parseInt(req.params.id), name: req.body.name });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });

    } finally {
        if (connection) await connection.close();
    }
});

 // DELETE an author
app.delete('/authors/:id', async (req, res) => {
    let connection;

    try {
        connection = await sql.connect(dbConfig);

        const request = connection.request();
        request.input('id', parseInt(req.params.id));

        const result = await request.query(
            'DELETE FROM Author WHERE AuthorID = @id'
        );

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ error: 'Not found' });
        }

        res.status(204).send();

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });

    } finally {
        if (connection) await connection.close();
    }
});

app.listen(3000, () => {
    console.log('Listening on port 3000');
});
