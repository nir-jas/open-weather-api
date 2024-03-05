const { Temperature } = require('../models');

/**
 * Create a Temprature
 * @param {Object} temperatureBody
 * @returns {Promise<Temperature>}
 */
const createTemprature = async (locationBody) => {
  const temperature = await Temperature.create(locationBody);

  return temperature;
};

/**
 * Get temperature by locationId
 * @param {ObjectId} locationId
 * @returns {Promise<Location>}
 */
const getTempratureByLocationId = async (locationId, filter = {}) => {
  const temperature = await Temperature.findOne({ location: locationId, deleted: false, ...filter })
    .select('-deleted')
    .sort({
      createdAt: -1,
    })
    .populate('location');

  return temperature;
};

/**
 * Get all tempratures
 * @returns {Promise<Location>}
 */
const getAllTempratures = async () => {
  const createdAt = new Date(Date.now() - 30 * 60 * 1000);
  const temperatures = await Temperature.aggregate([
    {
      $match: {
        deleted: false,
        createdAt: { $gte: createdAt },
      },
    },
    {
      $group: {
        _id: '$location',
        latestTemperature: {
          $top: {
            output: { temperature: '$temperature', location: '$location', createdAt: '$createdAt', _id: '$_id' },
            sortBy: { createdAt: -1 },
          },
        },
      },
    },
    {
      $replaceRoot: { newRoot: '$latestTemperature' },
    },
    {
      $lookup: {
        from: 'locations',
        localField: 'location',
        foreignField: '_id',
        as: 'location',
      },
    },
    {
      $unwind: '$location',
    },
    {
      $project: {
        _id: 0,
        id: '$_id',
        temperature: 1,
        location: {
          name: 1,
          lat: 1,
          long: 1,
          id: '$location._id',
        },
        createdAt: 1,
      },
    },
  ]);

  return temperatures;
};

/**
 * Delete temperature data for location
 * @param {ObjectId} locationId
 * @returns {Promise<Location>}
 */
const deleteTemperatureDataForLocation = async (locationId) => {
  const temperatures = await Temperature.updateMany({ location: locationId }, { deleted: true });

  return temperatures;
};

module.exports = {
  createTemprature,
  getTempratureByLocationId,
  getAllTempratures,
  deleteTemperatureDataForLocation,
};
