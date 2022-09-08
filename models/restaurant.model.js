const { Schema, model } = require('mongoose');

const restaurantSchema = new Schema({
  name: { type: String },
  description: { type: String },
  location: { type: { type: String }, coordinates: [Number] }
}, {
  timestamps: true,
  versionKey: false
})

restaurantSchema.index({ location: '2dsphere' });

const RestaurantModel = model('Restaurant', restaurantSchema);

module.exports = RestaurantModel;