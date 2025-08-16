// Configure these after extracting the project.
// 1) Copy this file to .env.local and set values, OR edit here for quick test.
export const USE_LIVE = process.env.REACT_APP_USE_LIVE === 'true'; // default false
export const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';
