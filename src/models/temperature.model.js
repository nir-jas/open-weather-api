const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const temperatureSchema = mongoose.Schema(
  {
    temperature: {
      type: Number,
      required: true,
    },
    location: { type: mongoose.Types.ObjectId, ref: 'Location', required: true, index: true },
    deleted: {
      type: Boolean,
      default: false,
      private: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
temperatureSchema.plugin(toJSON);
temperatureSchema.plugin(paginate);

/**
 * @typedef Temperature
 */
const Temperature = mongoose.model('Temperature', temperatureSchema);

module.exports = Temperature;
