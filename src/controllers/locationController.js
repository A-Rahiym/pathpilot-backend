import mapsService from '../services/mapsService.js';

/**
 * Reverse geocode coordinates to address
 */
export const reverseGeocode = async (req, res) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'Both lat and lng query parameters are required'
        }
      });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_COORDINATES',
          message: 'lat and lng must be valid numbers'
        }
      });
    }

    const result = await mapsService.reverseGeocode(latitude, longitude);

    res.json({
      success: true,
      data: {
        address: result.formattedAddress,
        coordinates: {
          lat: latitude,
          lng: longitude
        },
        placeId: result.placeId
      }
    });
  } catch (error) {
    console.error('Reverse geocode error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'GEOCODE_ERROR',
        message: 'Failed to reverse geocode coordinates',
        details: error.message
      }
    });
  }
};

/**
 * Find nearby places of a specific type
 */
export const findNearby = async (req, res) => {
  try {
    const { lat, lng, type, radius } = req.query;

    if (!lat || !lng || !type) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'lat, lng, and type query parameters are required'
        }
      });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const searchRadius = radius ? parseInt(radius) : 1500;

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_COORDINATES',
          message: 'lat and lng must be valid numbers'
        }
      });
    }

    const places = await mapsService.findNearbyPlaces(
      { lat: latitude, lng: longitude },
      type,
      searchRadius
    );

    res.json({
      success: true,
      data: {
        places,
        searchCenter: {
          lat: latitude,
          lng: longitude
        },
        type,
        radius: searchRadius,
        count: places.length
      }
    });
  } catch (error) {
    console.error('Find nearby error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'NEARBY_SEARCH_ERROR',
        message: 'Failed to find nearby places',
        details: error.message
      }
    });
  }
};

/**
 * Autocomplete place search
 */
export const autocomplete = async (req, res) => {
  try {
    const { query, lat, lng } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'query parameter is required'
        }
      });
    }

    let location = null;
    if (lat && lng) {
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lng);
      
      if (!isNaN(latitude) && !isNaN(longitude)) {
        location = { lat: latitude, lng: longitude };
      }
    }

    const predictions = await mapsService.autocomplete(query, location);

    res.json({
      success: true,
      data: {
        predictions,
        query
      }
    });
  } catch (error) {
    console.error('Autocomplete error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'AUTOCOMPLETE_ERROR',
        message: 'Failed to get autocomplete results',
        details: error.message
      }
    });
  }
};

/**
 * Get place details by place ID
 */
export const getPlaceDetails = async (req, res) => {
  try {
    const { placeId } = req.params;

    if (!placeId) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'placeId parameter is required'
        }
      });
    }

    const place = await mapsService.getPlaceDetails(placeId);

    res.json({
      success: true,
      data: place
    });
  } catch (error) {
    console.error('Get place details error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'PLACE_DETAILS_ERROR',
        message: 'Failed to get place details',
        details: error.message
      }
    });
  }
};
