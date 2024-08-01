const express = require('express');
const cors = require('cors');
let { db, nextId, requestsMap } = require('./db');
const { filterData, getRequestById, handleNewRequest } = require('./helpers');

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Get all requests
app.get('/api/requests', (req, res) => {
    try {
        const filters = req.query;
        const filteredData = filterData(db, filters);
        res.json(filteredData);
    } catch (error) {
        console.error('Error fetching requests:', error);
        res.status(500).json({ message: 'Error fetching requests' });
    }
});

// Get request by the request id
app.get('/api/requests/:id', (req, res) => {
    try {
        const { id } = req.params;
        const request = getRequestById(id.toString());
        if (request) {
            res.json(request);
        } else {
            res.status(404).json({ message: 'Request not found' });
        }
    } catch (error) {
        console.error('Error fetching request by ID:', error);
        res.status(500).json({ message: 'Error fetching request' });
    }
});

// Update request by its id
app.put('/api/requests/:id', (req, res) => {
    try {
        const requestId = parseInt(req.params.id, 10);
        const updatedRequest = req.body;

        if (requestsMap[requestId]) {
            const currentRequest = requestsMap[requestId];
            Object.assign(currentRequest, updatedRequest);
            currentRequest.updated_at = new Date();
            res.status(200).json(currentRequest);
        } else {
            res.status(404).json({ message: 'Request not found' });
        }
    } catch (error) {
        console.error('Error updating request:', error);
        res.status(500).json({ message: 'Error updating request' });
    }
});

// Add new request
app.post('/api/requests', (req, res) => {
    try {
        const newRequest = req.body;
        if (!newRequest.name || !newRequest.description) {
            return res.status(400).json({ message: 'Name and description are required' });
        }
        handleNewRequest(newRequest);
        db.push(newRequest);
        nextId++;
        res.status(201).json(newRequest);
    } catch (error) {
        console.error('Error creating new request:', error);
        res.status(500).json({ message: 'Error creating new request' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;
