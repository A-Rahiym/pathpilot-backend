import mapsService from '../services/maps.service.js';

export const getRoutes = async (req, res, next) => {
  try {
    const { origin, destination } = req.body;

    if (!origin || !destination) {
      return res.status(400).json({ error: 'Origin and destination are required' });
    }

    if (!process.env.GOOGLE_MAPS_API_KEY) {
      return res.status(400).json({ error: 'Google Maps API key not configured' });
    }

    const routes = await mapsService.getRoutes(origin, destination);

    res.json({
      success: true,
      routes
    });
  } catch (error) {
    next(error);
  }
};

export const geocode = async (req, res, next) => {
  try {
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({ error: 'Address is required' });
    }

    if (!process.env.GOOGLE_MAPS_API_KEY) {
      return res.status(400).json({ error: 'Google Maps API key not configured' });
    }

    const result = await mapsService.geocode(address);

    if (result) {
      res.json({
        success: true,
        ...result
      });
    } else {
      res.status(404).json({
        error: 'Location not found'
      });
    }
  } catch (error) {
    next(error);
  }
};
