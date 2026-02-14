import axios from 'axios';
import config from '../config/config.js';

class MapsService {
  constructor() {
    this.apiKey = config.mapsApiKey;
    this.baseUrl = 'https://maps.googleapis.com/maps/api';
  }

  /**
   * Geocode an address to coordinates
   * @param {string} address - Address to geocode
   * @returns {Promise<Object>} Location coordinates and formatted address
   */
  async geocodeAddress(address) {
    try {
      const response = await axios.get(`${this.baseUrl}/geocode/json`, {
        params: {
          address,
          key: this.apiKey
        }
      });

      if (response.data.results && response.data.results.length > 0) {
        const result = response.data.results[0];
        return {
          location: result.geometry.location,
          formattedAddress: result.formatted_address,
          placeId: result.place_id
        };
      }

      throw new Error('Location not found');
    } catch (error) {
      console.error('Geocoding error:', error);
      throw new Error('Failed to geocode address');
    }
  }

  /**
   * Reverse geocode coordinates to address
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @returns {Promise<Object>} Address information
   */
  async reverseGeocode(lat, lng) {
    console.log("API KEY:", process.env.GOOGLE_MAPS_API_KEY);
    try {
      const response = await axios.get(`${this.baseUrl}/geocode/json`, {
        params: {
          latlng: `${lat},${lng}`,
          key: this.apiKey
        }
      });

      if (response.data.results && response.data.results.length > 0) {
        const result = response.data.results[0];
        return {
          formattedAddress: result.formatted_address,
          addressComponents: result.address_components,
          placeId: result.place_id
        };
      }

      throw new Error('Address not found for coordinates');
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      throw new Error('Failed to reverse geocode coordinates');
    }
  }

  /**
   * Get directions between origin and destination
   * @param {Object} origin - Origin coordinates {lat, lng}
   * @param {Object} destination - Destination coordinates {lat, lng}
   * @param {string} mode - Travel mode (driving, walking, bicycling, transit)
   * @returns {Promise<Object>} Route information with polyline and steps
   */
  async getDirections(origin, destination, mode = 'walking') {
    try {
      const response = await axios.get(`${this.baseUrl}/directions/json`, {
        params: {
          origin: `${origin.lat},${origin.lng}`,
          destination: `${destination.lat},${destination.lng}`,
          mode,
          key: this.apiKey
        }
      });

      if (response.data.routes && response.data.routes.length > 0) {
        const route = response.data.routes[0];
        const leg = route.legs[0];

        return {
          polyline: route.overview_polyline.points,
          distance: leg.distance,
          duration: leg.duration,
          steps: leg.steps.map(step => ({
            instruction: step.html_instructions.replace(/<[^>]*>/g, ''), // Remove HTML tags
            distance: step.distance.text,
            duration: step.duration.text,
            polyline: step.polyline.points,
            startLocation: step.start_location,
            endLocation: step.end_location,
            maneuver: step.maneuver || 'straight'
          })),
          startAddress: leg.start_address,
          endAddress: leg.end_address
        };
      }

      throw new Error('No routes found');
    } catch (error) {
      console.error('Directions error:', error);
      throw new Error('Failed to get directions');
    }
  }

  /**
   * Search for nearby places
   * @param {Object} location - Center location {lat, lng}
   * @param {string} type - Place type (restaurant, pharmacy, hospital, etc.)
   * @param {number} radius - Search radius in meters (default 1500)
   * @returns {Promise<Array>} List of nearby places
   */
  async findNearbyPlaces(location, type, radius = 1500) {
    try {
      const response = await axios.get(`${this.baseUrl}/place/nearbysearch/json`, {
        params: {
          location: `${location.lat},${location.lng}`,
          radius,
          type,
          key: this.apiKey
        }
      });

      if (response.data.results) {
        return response.data.results.map(place => ({
          name: place.name,
          address: place.vicinity,
          location: place.geometry.location,
          placeId: place.place_id,
          rating: place.rating,
          openNow: place.opening_hours?.open_now,
          types: place.types
        }));
      }

      return [];
    } catch (error) {
      console.error('Nearby places error:', error);
      throw new Error('Failed to find nearby places');
    }
  }

  /**
   * Autocomplete place search
   * @param {string} input - Search query
   * @param {Object} location - Bias location {lat, lng}
   * @returns {Promise<Array>} Autocomplete predictions
   */
  async autocomplete(input, location = null) {
    try {
      const params = {
        input,
        key: this.apiKey
      };

      if (location) {
        params.location = `${location.lat},${location.lng}`;
        params.radius = 50000; // 50km bias
      }

      const response = await axios.get(`${this.baseUrl}/place/autocomplete/json`, {
        params
      });

      if (response.data.predictions) {
        return response.data.predictions.map(prediction => ({
          description: prediction.description,
          placeId: prediction.place_id,
          mainText: prediction.structured_formatting.main_text,
          secondaryText: prediction.structured_formatting.secondary_text
        }));
      }

      return [];
    } catch (error) {
      console.error('Autocomplete error:', error);
      throw new Error('Failed to get autocomplete results');
    }
  }

  /**
   * Get place details by place ID
   * @param {string} placeId - Google Place ID
   * @returns {Promise<Object>} Place details including coordinates
   */
  async getPlaceDetails(placeId) {
    try {
      const response = await axios.get(`${this.baseUrl}/place/details/json`, {
        params: {
          place_id: placeId,
          fields: 'name,formatted_address,geometry,rating,opening_hours,formatted_phone_number',
          key: this.apiKey
        }
      });

      if (response.data.result) {
        const place = response.data.result;
        return {
          name: place.name,
          address: place.formatted_address,
          location: place.geometry.location,
          rating: place.rating,
          phoneNumber: place.formatted_phone_number,
          openNow: place.opening_hours?.open_now
        };
      }

      throw new Error('Place not found');
    } catch (error) {
      console.error('Place details error:', error);
      throw new Error('Failed to get place details');
    }
  }
}

export default new MapsService();
