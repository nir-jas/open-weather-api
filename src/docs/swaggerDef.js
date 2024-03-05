const { version } = require('../../package.json');
const config = require('../config/config');

const swaggerDef = {
  openapi: '3.0.0',
  info: {
    title: 'OpenWeather API',
    version,
    license: {
      name: 'MIT',
      url: 'https://github.com/nir-jas/open-weather-api.git',
    },
  },
  servers: [
    {
      url: `http://localhost:${config.port}/api/v1`,
    },
  ],
};

module.exports = swaggerDef;
