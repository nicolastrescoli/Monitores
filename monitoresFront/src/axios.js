import axios from 'axios';

// La URL base de tu backend Laravel
axios.defaults.baseURL = 'http://localhost:8000';

// Muy importante: esto permite que Axios envíe las cookies (necesario para CSRF)
axios.defaults.withCredentials = true;

export default axios;
