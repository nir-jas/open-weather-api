const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getWeather = {
  query: Joi.object().keys({
    location: Joi.string().required(),
  }),
};

const deleteWeatherData = {
  params: Joi.object().keys({
    locationId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  getWeather,
  deleteWeatherData,
};
