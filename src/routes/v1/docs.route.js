const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerDefinition = require('../../docs/swaggerDef');

const router = express.Router();

const specs = swaggerJsdoc({
  swaggerDefinition,
  apis: ['src/docs/*.yml', 'src/routes/v1/*.js'],
  externalDocs: {
    description: 'swagger.json',
    url: '/swagger.json',
  },
});

router.use('/', swaggerUi.serve);
router.get(
  '/',
  swaggerUi.setup(specs, {
    explorer: false,
  })
);

router.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(specs);
});

module.exports = router;
