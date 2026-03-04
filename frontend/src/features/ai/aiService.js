import axios from 'axios';

const API_URL = '/api/ai/';

const reviewCode = async (data, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    const response = await axios.post(API_URL + 'review', data, config);
    return response.data;
};

const aiService = { reviewCode };
export default aiService;
