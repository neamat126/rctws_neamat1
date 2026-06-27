// Base URL for the backend API
// In development: http://localhost:3001
// In production:  set VITE_API_URL in your hosting environment variables
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default API_BASE;
