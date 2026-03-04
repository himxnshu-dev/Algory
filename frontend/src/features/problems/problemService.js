import axios from 'axios';

const API_URL = '/api/problems/';

const getConfig = (token) => ({
    headers: { Authorization: `Bearer ${token}` },
});

const getProblems = async (token, filters = {}) => {
    const params = new URLSearchParams();
    if (filters.topic) params.append('topic', filters.topic);
    if (filters.difficulty) params.append('difficulty', filters.difficulty);
    if (filters.status) params.append('status', filters.status);

    const response = await axios.get(
        API_URL + (params.toString() ? `?${params}` : ''),
        getConfig(token)
    );
    return response.data;
};

const createProblem = async (problemData, token) => {
    const response = await axios.post(API_URL, problemData, getConfig(token));
    return response.data;
};

const updateProblem = async (id, problemData, token) => {
    const response = await axios.put(
        API_URL + id,
        problemData,
        getConfig(token)
    );
    return response.data;
};

const deleteProblem = async (id, token) => {
    const response = await axios.delete(API_URL + id, getConfig(token));
    return response.data;
};

const getStats = async (token) => {
    const response = await axios.get(API_URL + 'stats', getConfig(token));
    return response.data;
};

const problemService = {
    getProblems,
    createProblem,
    updateProblem,
    deleteProblem,
    getStats,
};
export default problemService;
