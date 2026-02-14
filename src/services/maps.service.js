import axios from 'axios';

class MapsService {
  constructor() {
    this.apiKey = process.env.GOOGLE_MAPS_API_KEY;
  }

  async getRoutes(origin, destination) {
    const response = await axios.post(
      'https://routes.googleapis.com/directions/v2:computeRoutes',
      {
        origin: { address: origin },
        destination: { address: destination },
        travelMode: 'DRIVE',
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
          'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.polyline,routes.legs'
        }
      }
    );

    return response.data.routes || [];
  }

  async geocode(address) {
    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/geocode/json',
      {
        params: {
          address,
          key: this.apiKey
        }
      }
    );

    if (response.data.results && response.data.results.length > 0) {
      return {
        location: response.data.results[0].geometry.location,
        formattedAddress: response.data.results[0].formatted_address
      };
    }

    return null;
  }
}

export default new MapsService();
