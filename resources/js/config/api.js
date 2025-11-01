// API Configuration
// Automatically uses the correct URL for local development and production

const getApiUrl = () => {
    // In production, use the current domain
    if (import.meta.env.PROD) {
        return window.location.origin;
    }
    // In development, use localhost
    return 'http://127.0.0.1:8000';
};

export const API_URL = getApiUrl();

// Helper function for API requests
export const apiUrl = (path) => {
    // Remove leading slash if present to avoid double slashes
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${API_URL}/${cleanPath}`;
};

export default API_URL;
