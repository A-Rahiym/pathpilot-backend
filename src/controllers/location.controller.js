import * as mapsService from '../services/maps.service.js';
import { formatSuccessResponse, formatErrorResponse } from '../utils/response.formatter.js';

/**
 * Geocode address to coordinates
 * POST /api/location/geocode
 */
export const geocode = async (req, res) => {
  try {
    const { address } = req.body;

    if (!address || typeof address !== 'string') {
      return res.status(400).json(
        formatErrorResponse('VALIDATION_ERROR', 'Address is required and must be a string')
      );
    }

    if (address.trim().length === 0) {
      return res.status(400).json(
        formatErrorResponse('VALIDATION_ERROR', 'Address cannot be empty')
      );
    }

    // Geocode using Maps service
    const result = await mapsService.geocodeAddress(address);

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error in geocode controller:', error);
    
    if (error.message.includes('not found')) {
      return res.status(404).json(
        formatErrorResponse('LOCATION_NOT_FOUND', error.message)
      );
    }

    return res.status(500).json(
      formatErrorResponse('GEOCODING_ERROR', error.message)
    );
  }
};

/**
 * Reverse geocode coordinates to address
 * GET /api/location/reverse-geocode
 */
export const reverseGeocode = async (req, res) => {
  try {
    const { lat, lng } = req.query;

    // Validate inputs
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json(
        formatErrorResponse('VALIDATION_ERROR', 'Valid latitude and longitude are required')
      );
    }

    if (latitude < -90 || latitude > 90) {
      return res.status(400).json(
        formatErrorResponse('VALIDATION_ERROR', 'Latitude must be between -90 and 90')
      );
    }

    if (longitude < -180 || longitude > 180) {
      return res.status(400).json(
        formatErrorResponse('VALIDATION_ERROR', 'Longitude must be between -180 and 180')
      );
    }

    // Reverse geocode using Maps service
    const result = await mapsService.reverseGeocode(latitude, longitude);

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error in reverseGeocode controller:', error);
    
    if (error.message.includes('not found')) {
      return res.status(404).json(
        formatErrorResponse('ADDRESS_NOT_FOUND', error.message)
      );
    }

    return res.status(500).json(
      formatErrorResponse('REVERSE_GEOCODING_ERROR', error.message)
    );
  }
};

/**
 * Search places with autocomplete
 * GET /api/location/search
 */
export const searchPlaces = async (req, res) => {
  try {
    const { query, lat, lng } = req.query;

    if (!query || typeof query !== 'string') {
      return res.status(400).json(
        formatErrorResponse('VALIDATION_ERROR', 'Search query is required and must be a string')
      );
    }

    if (query.trim().length === 0) {
      return res.status(400).json(
        formatErrorResponse('VALIDATION_ERROR', 'Search query cannot be empty')
      );
    }

    // Parse location if provided
    let location = null;
    if (lat && lng) {
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lng);
      
      if (!isNaN(latitude) && !isNaN(longitude)) {
        location = { lat: latitude, lng: longitude };
      }
    }

    // Search places using Maps service
    const result = await mapsService.searchPlaces(query, location);

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error in searchPlaces controller:', error);
    return res.status(500).json(
      formatErrorResponse('PLACE_SEARCH_ERROR', error.message)
    );
  }
};

/**
 * Get place details by place ID
 * GET /api/location/place/:placeId
 */
export const getPlaceDetails = async (req, res) => {
  try {
    const { placeId } = req.params;

    if (!placeId) {
      return res.status(400).json(
        formatErrorResponse('VALIDATION_ERROR', 'Place ID is required')
      );
    }

    // Get place details using Maps service
    const result = await mapsService.getPlaceDetails(placeId);

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error in getPlaceDetails controller:', error);
    return res.status(500).json(
      formatErrorResponse('PLACE_DETAILS_ERROR', error.message)
    );
  }
};

export default {
  geocode,
  reverseGeocode,
  searchPlaces,
  getPlaceDetails,
};
