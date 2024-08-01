// app.js

const express = require('express');
const cors = require('cors');
let {db, nextId} = require('./db');
const { requestsMap } = require('./db.js');

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

const filterData = (data, filters) => {
    return Object.keys(filters).reduce((filteredData, key) => {
        if (filters[key]) {
            return filteredData.filter(item =>
                item[key].toLowerCase().includes(filters[key].toLowerCase())
            );
        }
        return filteredData;
    }, data);
};

const getRequestById = (id) => requestsMap[id] || null;
const handleNewRequest = (request) => {
    while (requestsMap[nextId]) {
        nextId++; // make sure id is unique
    }
    request.id = nextId;
    request.created_at = new Date();
    request.updated_at = null; // Initial value for updated_at
    requestsMap[request.id] = request;

    return request;
}
// Get all requests
app.get('/api/requests', (req, res) => {
    const filters = req.query;
    const filteredData = filterData(db, filters);
    res.json(filteredData);
});

app.get('/api/requests/:id', (req, res) => {
    const { id } = req.params;
    res.json(getRequestById(id.toString()));
});

app.put('/api/requests/:id', (req, res) => {
    const requestId = parseInt(req.params.id, 10);
    const updatedRequest = req.body;

    if (requestsMap[requestId]) {
        // Update only the properties that are provided in the request body
        const currentRequest = requestsMap[requestId];
        Object.assign(currentRequest, updatedRequest);
        currentRequest.updated_at = new Date(); // Update the timestamp
        res.status(200).json(currentRequest);
    } else {
        res.status(404).json({ message: 'Request not found' });
    }
});

app.post('/api/requests', (req, res) => {
    const newRequest = req.body;
    newRequest.id = nextId; // Assign the next available ID
    db.push(newRequest);
    handleNewRequest(newRequest);
    nextId++; // Increment the next ID for the next entry
    res.status(201).json(newRequest);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
