import dotenv from 'dotenv';

dotenv.config();

// Google Maps API configuration
export const MAPS_CONFIG = {
  API_KEY: process.env.GOOGLE_MAPS_API_KEY,
  BASE_URLS: {
    GEOCODING: 'https://maps.googleapis.com/maps/api/geocode/json',
    DIRECTIONS: 'https://routes.googleapis.com/directions/v2:computeRoutes',
    PLACES: 'https://maps.googleapis.com/maps/api/place',
  },
  DEFAULT_PARAMS: {
    travelMode: 'DRIVE',
    computeAlternativeRoutes: true,
    routeModifiers: {
      avoidTolls: false,
      avoidHighways: false,
      avoidFerries: false,
    },
  },
  FIELD_MASKS: {
    ROUTES: 'routes.duration,routes.distanceMeters,routes.polyline,routes.legs',
  },
};

/**
 * Validate Google Maps API key
 * @returns {boolean} True if API key is configured
 */
export const validateMapsKey = () => {
  return !!process.env.GOOGLE_MAPS_API_KEY;
};

export default {
  MAPS_CONFIG,
  validateMapsKey,
};
