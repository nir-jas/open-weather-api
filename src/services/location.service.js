const { Location } = require('../models');

/**
 * Create a location
 * @param {Object} locationBody
 * @returns {Promise<Location>}
 */
const createLocation = async (locationBody) => {
  const location = await Location.create(locationBody);

  return location;
};

/**
 * Get location by name
 * @param {String} locationName
 * @returns {Promise<Location>}
 */
const getLocationByName = async (locationName) => {
  return Location.findOne({ name: locationName });
};

/**
 * Get location by id
 * @param {ObjectId} locationId
 * @returns {Promise<Location>}
 */
const getLocationById = async (locationId) => {
  return Location.findById(locationId);
};

module.exports = {
  createLocation,
  getLocationByName,
  getLocationById,
};
