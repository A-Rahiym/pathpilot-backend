import axios from 'axios';

class MapsService {
  constructor() {
    this.apiKey = process.env.GOOGLE_MAPS_API_KEY;
    // Base URLs for the two different services
    this.routesUrl = 'https://routes.googleapis.com/directions/v2:computeRoutes';
    this.geocodeUrl = 'https://maps.googleapis.com/maps/api/geocode/json';
  }

  async getRoutes(origin, destination) {
    try {
      const response = await axios.post(
        this.routesUrl,
        {
          // Using addresses is fine, but Place IDs are preferred for performance
          origin: { address: origin },
          destination: { address: destination },
          travelMode: 'DRIVE',
          routingPreference: 'TRAFFIC_AWARE', // Vital for accurate ETAs
          computeAlternativeRoutes: true,
          routeModifiers: {
            avoidTolls: false,
            avoidHighways: false,
            avoidFerries: false
          }
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': this.apiKey,
            // ALARM: Fixed field mask to be explicit
            'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline'
          }
        }
      );

      return response.data.routes || [];
    } catch (error) {
      console.error("Routes API Error:", error.response?.data || error.message);
      throw error;
    }
  }

  async geocode(address) {
    try {
      const response = await axios.get(this.geocodeUrl, {
        params: {
          address,
          key: this.apiKey
        }
      });

      if (response.data.status === 'OK') {
        const result = response.data.results[0];
        return {
          location: result.geometry.location,
          formattedAddress: result.formatted_address,
          placeId: result.place_id // Store this to use in getRoutes!
        };
      }
      return null;
    } catch (error) {
      console.error("Geocoding API Error:", error.message);
      return null;
    }
  }
}

export default new MapsService();