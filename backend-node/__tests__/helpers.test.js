const { filterData, getRequestById, handleNewRequest } = require('../helpers');
const { requestsMap } = require('../db');

describe('filterData', () => {
    it('should filter data based on given filters', () => {
        const data = [
            { name: 'Alice', status: 'pending' },
            { name: 'Bob', status: 'approved' },
            { name: 'Charlie', status: 'pending' },
        ];

        const filters = { name: 'Alice' };
        const result = filterData(data, filters);
        expect(result).toEqual([{ name: 'Alice', status: 'pending' }]);
    });

    it('should return all data if filters are empty', () => {
        const data = [
            { name: 'Alice', status: 'pending' },
            { name: 'Bob', status: 'approved' },
            { name: 'Charlie', status: 'pending' },
        ];

        const filters = {};
        const result = filterData(data, filters);
        expect(result).toEqual(data);
    });
});

describe('getRequestById', () => {
    it('should return request if id exists', () => {
        const id = '1';
        requestsMap[id] = { id: '1', name: 'Test Request' };

        const result = getRequestById(id);
        expect(result).toEqual({ id: '1', name: 'Test Request' });
    });

    it('should return null if id does not exist', () => {
        const id = '999';
        const result = getRequestById(id);
        expect(result).toBeNull();
    });
});

describe('handleNewRequest', () => {
    it('should add a new request and return it', () => {
        const request = { name: 'New Request', description: 'desc test', type: 'purchase', amount: 222, currency: 'USD', employee_name: 'Alice Doe', status: 'Declined' };

        const result = handleNewRequest(request);
        expect(result).toHaveProperty('id');
        expect(result).toHaveProperty('created_at');
        expect(result).toHaveProperty('updated_at', null);
        expect(requestsMap[result.id]).toEqual(result);
    });

    it('should assign a unique id to each new request', () => {
        const request1 = { name: 'Request 1' };
        const request2 = { name: 'Request 2' };

        const result1 = handleNewRequest(request1);
        const result2 = handleNewRequest(request2);

        expect(result1.id).not.toEqual(result2.id);
    });
});
