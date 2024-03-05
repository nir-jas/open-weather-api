const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { weatherService } = require('../services');

const getWeather = catchAsync(async (req, res) => {
  const {
    query: { location },
  } = req;

  const weather = await weatherService.getWeather(location);

  if (!weather) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Weather data not found!');
  }

  res.send(weather);
});

const getAllWeatherData = catchAsync(async (req, res) => {
  const weatherData = await weatherService.getAllWeatherData();

  res.send(weatherData);
});

const deleteWeatherData = catchAsync(async (req, res) => {
  const { locationId } = req.params;

  await weatherService.deleteWeatherData(locationId);

  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  getWeather,
  getAllWeatherData,
  deleteWeatherData,
};
