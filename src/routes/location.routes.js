import express from 'express';
import { 
  reverseGeocode, 
  findNearby, 
  autocomplete,
  getPlaceDetails 
} from '../controllers/locationController.js';

const router = express.Router();

/**
 * @route   GET /api/location/reverse-geocode
 * @desc    Convert coordinates to address
 * @access  Public
 */
router.get('/reverse-geocode', reverseGeocode);

/**
 * @route   GET /api/location/nearby
 * @desc    Find nearby places of a specific type
 * @access  Public
 */
router.get('/nearby', findNearby);

/**
 * @route   GET /api/location/autocomplete
 * @desc    Autocomplete place search
 * @access  Public
 */
router.get('/autocomplete', autocomplete);

/**
 * @route   GET /api/location/place/:placeId
 * @desc    Get place details by place ID
 * @access  Public
 */
router.get('/place/:placeId', getPlaceDetails);

export default router;
