const express = require('express');

const validate = require('../../middlewares/validate');
const weatherValidation = require('../../validations/weather.validation');
const weatherController = require('../../controllers/weather.controller');

const router = express.Router();

// To get weather data for a location
router.route('/').get(validate(weatherValidation.getWeather), weatherController.getWeather);

// To get all weather data
router.route('/all').get(weatherController.getAllWeatherData);

// To delete weather data for a location
router
  .route('/locations/:locationId')
  .delete(validate(weatherValidation.deleteWeatherData), weatherController.deleteWeatherData);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: weather
 *   description: weather data and operations
 */

/**
 * @swagger
 * /weather:
 *   get:
 *     summary: Get weather data
 *     description: Get weather data for a location
 *     tags: [weather]
 *     parameters:
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         required: true
 *         description: Location to get weather data
 *     responses:
 *       '200':
 *         description: Weather data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Weather'
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '404':
 *         description: Weather data not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * /weather/all:
 *   get:
 *     summary: Get all weather data
 *     description: Get all weather data
 *     tags: [weather]
 *     responses:
 *       '200':
 *         description: Weather data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                $ref: '#/components/schemas/Weather'
 *
 * /weather/locations/{locationId}:
 *   delete:
 *     summary: Delete weather data
 *     description: Delete weather data for a location
 *     tags: [weather]
 *     parameters:
 *       - in: path
 *         name: locationId
 *         schema:
 *           type: string
 *         required: true
 *         description: Location id
 *     responses:
 *       '204':
 *         description: Weather data deleted successfully
 *       '404':
 *         description: Location not found
 */
