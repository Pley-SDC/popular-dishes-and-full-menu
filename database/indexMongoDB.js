const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/sdc', { useNewUrlParser: true });

const { Schema } = mongoose;

const restaurantSchema = new Schema({
  id: Number,
  restaurant_name: String,
  dishes: [{
    dish_name: String,
    dish_price: Number,
    dish_reviews: [{
      user_name: String,
      review_text: String,
      date: Date,
    }],
    dish_images: [{
      user_name: String,
      url: String,
      date: Date,
    }],
  }],
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

console.log('=========>>> connected to mongoDB');

process.exit();

module.exports = {
  Restaurant,
};
