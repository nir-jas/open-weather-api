const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');

const { locationService, temperatureService } = require('.');
const openWeather = require('../providers/openweather');

/**
 * Get Geo Data by location name
 *
 * @param {String} locationName
 * @returns {Promise<Location>}
 */
const _getGeoData = async (locationName) => {
  try {
    logger.info(`Getting Geo Data for location: ${locationName}`);
    let location = await locationService.getLocationByName(locationName);

    if (!location) {
      const geoData = await openWeather.getGeoCordinates(locationName);

      if (geoData && geoData.length) {
        const [{ lat, lon }] = geoData;

        location = await locationService.createLocation({ name: locationName, lat, long: lon });
      }
    }

    logger.info(`Geo Data for location: ${locationName} fetched successfully.`);
    return location;
  } catch (error) {
    logger.error(error.message);
    throw new Error(error.message);
  }
};

/**
 * Get temperature by location
 * @param {Object} location
 * @returns {Promise<Temperature>}
 */
const _getTemperature = async (location) => {
  try {
    logger.info(`Getting temperature for location: ${location.id}`);

    const createdAt = new Date(Date.now() - 30 * 60 * 1000);
    let temperature = await temperatureService.getTempratureByLocationId(location.id, {
      createdAt: { $gte: createdAt },
    });

    if (!temperature) {
      const currentWeather = await openWeather.getCurrentWeather(location.lat, location.long);

      if (currentWeather) {
        const {
          main: { temp = null },
        } = currentWeather;

        if (!temp) {
          return null;
        }

        temperature = await temperatureService.createTemprature({ location: location.id, temperature: temp });

        if (temperature) {
          temperature = await temperature.populate('location').execPopulate();
        }
      }
    }

    logger.info(`Temperature for location: ${location.id} fetched successfully.`);
    return temperature;
  } catch (error) {
    logger.error(error.message);
    throw new Error(error.message);
  }
};

const getWeather = async (locationName) => {
  try {
    logger.info(`[weatherService] Getting weather data for location: ${locationName}`);
    const location = await _getGeoData(locationName);

    if (!location) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Location not found');
    }

    const temperature = await _getTemperature(location);

    logger.info(`[weatherService] Weather data for location: ${locationName} fetched successfully!`);
    return temperature;
  } catch (error) {
    logger.error(error.message);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const getAllWeatherData = async () => {
  try {
    logger.info('[weatherService] Getting all weather data!');
    const temperatures = await temperatureService.getAllTempratures();

    logger.info('[weatherService] All weather data fetched successfully!');
    return temperatures;
  } catch (error) {
    logger.error(error.message);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const deleteWeatherData = async (locationId) => {
  try {
    logger.info(`[weatherService] Deleting weather data for location with id: ${locationId}`);
    const location = await locationService.getLocationById(locationId);
    if (!location) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Location not found');
    }

    await temperatureService.deleteTemperatureDataForLocation(locationId);

    logger.info(`[weatherService] Weather data for location with id: ${locationId} deleted successfully!`);
    return true;
  } catch (error) {
    logger.error(error.message);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

module.exports = {
  getWeather,
  getAllWeatherData,
  deleteWeatherData,
};
