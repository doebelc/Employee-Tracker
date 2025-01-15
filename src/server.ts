import express, { type Request, type Response } from 'express';
import { QueryResult } from 'pg';
import { pool, connectToDb } from './connection.js';

await connectToDb();

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


// POST REQUEST FOR NEW DEPARTMENT
app.post('/api/new-department', async ({ body }, res) => {

    const sql = 'INSERT INTO departments (department_name) VALUES ($1)';
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


// POST REQUEST FOR NEW ROLE
// const express = require('express');
// const router = express.Router();
// const db = require('./db'); // Assuming you have a database module to handle DB operations
app.post('/api/roles', async (req, res) => {
    const { title, salary, department_id } = req.body;

    // Validate input
    if (!title || !salary || !department_id) {
        return res.status(400).json({ error: 'All fields are required' });

    } try {
        // Insert the new role into the database
        const newRole = await departments_db.insertRole({ title, salary, department_id });

        // Respond with the created role
        res.status(201).json(newRole);
    } catch (error) {
        console.error('Error adding role:', error);
        res.status(500).json({ error: 'An error occurred while adding the role' });
    }
});
// module.exports = router;


// POST REQUEST FOR NEW EMPLOYEE
app.post('/api/employees', async (req, res) => {

    const { first_name, last_name, role_id, manager_id } = req.body;

    if (!first_name || !last_name || !role_id || !manager_id) {
        return res.status(400).json({ error: 'All fields are required' });
    } try {
        const newEmployee = await departments_db.insertEmployee({ first_name, last_name, role_id, manager_id });
        res.status(201).json(newEmployee);
    } catch (error) {
        console.error('Error adding employee:', error);
        res.status(500).json({ error: 'An error occurred while adding the employee' });
    }
});





// GET REQUEST FOR DEPARTMENTS
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


// GET REQUEST FOR ROLES




// GET REQUEST FOR EMPLOYEES



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