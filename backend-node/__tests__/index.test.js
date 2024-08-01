const request = require('supertest');
const app = require('../index'); // Ensure this path matches your project structure

describe('API Endpoints', () => {
    let newRequestId;

    // GET /api/requests
    it('should fetch all requests with filters', async () => {
        const response = await request(app).get('/api/requests').query({ name: 'Test' });
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    // GET /api/requests/:id
    it('should fetch a request by id', async () => {
        const response = await request(app).get('/api/requests/1');
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('id', 1);
    });

    it('should return 404 if request is not found', async () => {
        const response = await request(app).get('/api/requests/9999');
        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty('message', 'Request not found');
    });

    // PUT /api/requests/:id
    it('should update a request by id', async () => {
        const response = await request(app)
            .put('/api/requests/1')
            .send({ name: 'Updated Name' });
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('name', 'Updated Name');
    });

    it('should return 404 if trying to update a non-existent request', async () => {
        const response = await request(app)
            .put('/api/requests/9999')
            .send({ name: 'Non-existent Request' });
        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty('message', 'Request not found');
    });

    // POST /api/requests
    it('should create a new request', async () => {
        const fakeRequest = { name: 'New Request', description: 'desc test', type: 'purchase', amount: 222, currency: 'USD', employee_name: 'Alice Doe', status: 'Declined' };
        const response = await request(app)
            .post('/api/requests')
            .send(fakeRequest);
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('name', 'New Request');
        newRequestId = response.body.id;
    });

    it('should return 400 if name or description is missing', async () => {
        const response = await request(app)
            .post('/api/requests')
            .send({ name: 'Invalid Request' });
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('message', 'Name and description are required');
    });

    // Handling route that does not exist
    it('should return 404 for undefined routes', async () => {
        const response = await request(app).get('/api/undefined-route');
        expect(response.statusCode).toBe(404);
    });
});
