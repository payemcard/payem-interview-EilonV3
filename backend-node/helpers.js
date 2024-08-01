let { requestsMap, nextId } = require('./db');

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
};

module.exports = {
    filterData,
    getRequestById,
    handleNewRequest
};
