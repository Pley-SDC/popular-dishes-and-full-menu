const mongoose = require('mongoose');
require('mongoose-explain');

mongoose.connect('mongodb://localhost:27017/sdc2', { useNewUrlParser: true });

const { Schema } = mongoose;

const restaurantSchema = new Schema({
  _id: Number,
  restaurant_name: String,
  dishes: [{
    dish_id: Number,
    dish_name: String,
    dish_description: String,
    dish_price: Number,
    dish_reviews: [{
      review_id: Number,
      user_name: String,
      review_text: String,
      date: Date,
    }],
    dish_images: [{
      image_id: Number,
      user_name: String,
      url: String,
      date: Date,
    }],
  }],
});

// restaurantSchema.plugin(explain);

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

console.log('=========>>> connected to mongoDB');

module.exports = {
  Restaurant,
};
