const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const locationSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    lat: { type: Number, required: true },
    long: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
locationSchema.plugin(toJSON);
locationSchema.plugin(paginate);

/**
 * @typedef Location
 */
const Location = mongoose.model('Location', locationSchema);

module.exports = Location;
