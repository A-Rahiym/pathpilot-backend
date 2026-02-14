import mapsService from '../services/mapsService.js';

/**
 * Get directions from origin to destination
 */
export const getDirections = async (req, res) => {
  try {
    const { origin, destination, mode } = req.body;

    if (!origin || !destination) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'Both origin and destination are required'
        }
      });
    }

    // Validate origin coordinates
    if (!origin.lat || !origin.lng) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_ORIGIN',
          message: 'Origin must include lat and lng coordinates'
        }
      });
    }

    // Destination can be either coordinates or address string
    let destinationCoords = destination;
    
    if (typeof destination === 'string') {
      // Geocode the destination address
      const geocoded = await mapsService.geocodeAddress(destination);
      destinationCoords = geocoded.location;
    } else if (!destination.lat || !destination.lng) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_DESTINATION',
          message: 'Destination must be address string or include lat and lng coordinates'
        }
      });
    }

    const route = await mapsService.getDirections(origin, destinationCoords, mode);

    res.json({
      success: true,
      data: {
        route,
        origin,
        destination: destinationCoords
      }
    });
  } catch (error) {
    console.error('Get directions error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'DIRECTIONS_ERROR',
        message: 'Failed to get directions',
        details: error.message
      }
    });
  }
};
