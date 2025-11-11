// src/services/apiClient.js
import axios from 'axios';

const api = axios.create({
  // Make sure baseURL includes protocol so axios doesn't treat it as a relative URL.
  // Prefer an env var (CRA: REACT_APP_API_URL) and fallback to the production host.
  // baseURL: 'https://dailydinepro.azurewebsites.net',
  baseURL: 'http://192.168.1.6:8080',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // Accept 2xx and 3xx as successful so a 302 from the server can be handled by the client
  // (axios by default treats only 2xx as success).
  validateStatus: (status) => status >= 200 && status < 400,
});

export default api;
