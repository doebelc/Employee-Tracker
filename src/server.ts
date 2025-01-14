import express, { type Request, type Response } from 'express';
import { QueryResult } from 'pg';
import { pool, connectToDb } from './connection.js';

await connectToDb();

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Create
app.post('/api/new-department', async ({ body }, res) => {

    const sql = 'INSERT INTO movies (department_name) VALUES ($1)';
    const params = [body.department_name];

    pool.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'Success',
            data: body,
        });
    });
});


app.get('/api/department/:id', async (_req, res) => {

    const sql = 'SELECT id, department_name AS title FROM departments';

    try {
        const result = await pool.query(sql);
        const { rows } = result;
        res.json({
            message: 'Success',
            data: rows,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



app.delete('/api/departments/:id', (req, res) => {
    const sql = 'Delete FROM departments WHERE id = $1';
    const params = [req.params.id];
});


app.get('/api/movie-reviews', (_req, res) => {
    const sql = 'SELECT movies.movie_name AS movie, reviews.review FROM reviews LEFT JOIN movies ON reviews.movie_id = movies.id ORDER BY movies.movie_name;';
});


// Create a route to update
app.put('/api/review/:id', (req, res) => {
    const sql = 'UPDATE reviews SET review = $1 WHERE id = $2';
    const params = [req.body.review, req.params.id];
});


// Default response for any other request (Not Found)
app.use((_req, res) => {
    res.status(404).end();
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});