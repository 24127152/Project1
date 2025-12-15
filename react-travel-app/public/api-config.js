// API Configuration
// Change BACKEND_URL to your Render backend URL
const BACKEND_URL = 'https://project1-9-xejo.onrender.com'; // Render backend URL

// Or use relative path if backend is on same domain
// const BACKEND_URL = '';

// Helper function to build API URL
function apiUrl(path) {
    return BACKEND_URL ? `${BACKEND_URL}${path}` : path;
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { apiUrl, BACKEND_URL };
}
