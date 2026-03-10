// Google Maps API Configuration
// To enable Google Maps Places Autocomplete in the location picker:
// 1. Get an API key from: https://console.cloud.google.com/google/maps-apis
// 2. Enable the Places API for your project
// 3. Replace 'YOUR_API_KEY_HERE' below with your actual API key
// 4. For production, use environment variables instead

export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY_HERE';

// Note: The location picker will work without the API key (showing saved locations only)
// but Google Maps search functionality requires a valid API key
