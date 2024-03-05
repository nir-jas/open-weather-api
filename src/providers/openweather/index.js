const axios = require('axios');
const config = require('../../config/config');
const logger = require('../../config/logger');

const client = axios.create({
  baseURL: 'https://api.openweathermap.org',
  headers: {
    'Content-Type': 'application/json',
  },
  params: {
    appid: config.openWeather.apiKey,
  },
});

module.exports = {
  getGeoCordinates: async (locationName) => {
    try {
      logger.info(`[OpenWeather] Getting geo cordinates for location: ${locationName}`);
      const response = await client.get('/geo/1.0/direct', {
        params: {
          q: locationName,
          limit: 1,
        },
      });

      logger.info(`[OpenWeather] Geo cordinates for location: ${locationName} fetched successfully.`);
      return response.data;
    } catch (error) {
      logger.error(`[OpenWeather] getGeoCordinates(${locationName}) ${error.message}`);
      throw new Error(error.message);
    }
  },
  getCurrentWeather: async (lat, lon) => {
    try {
      logger.info(`[OpenWeather] Getting current weather for location: ${lat}, ${lon}`);
      const response = await client.get('/data/2.5/weather', {
        params: {
          lat,
          lon,
        },
      });

      logger.info(`[OpenWeather] Current weather for location: ${lat}, ${lon} fetched successfully.`);
      return response.data;
    } catch (error) {
      logger.error(`[OpenWeather] getCurrentWeather(${(lat, lon)}}) ${error.message}`);
      logger.error(error.message);
      throw new Error(error.message);
    }
  },
};
