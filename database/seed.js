const fs = require('fs');
const faker = require('faker');
const path = require('path');

const restaurantStream = fs.createWriteStream(path.join(__dirname, '/restaurants.csv'));
const dishesStream = fs.createWriteStream(path.join(__dirname, '/dishes.csv'));
restaurantStream.write('restaurant_name\n');
dishesStream.write('restaurant_id, dish_name, price, number_of_photos, number_of_reviews\n');

/* =======================>>>> Constraints <<<<<<<=========================== */

const numberOfRestaurants = 1000000;
const maximumDishesPerRestaurant = 20;
const minimumDishesPerRestaurant = 3;
const maximumPhotosPerDish = 60;
const maximumReviewsPerDish = 60;

/* =======================>>>> Constraints <<<<<<<=========================== */

let restaurantIndex = 0;
let dishIndex;

const createNumber = (min, max) => Math.floor(Math.random() * (max - min) + min);

const createDishesDataCSV = () => {
  while (restaurantIndex > 0) {
    const NumberOfDishes = createNumber(minimumDishesPerRestaurant,
      maximumDishesPerRestaurant);
    dishIndex = 0;
    while (dishIndex < NumberOfDishes) {
      // const jpegNumber = Math.floor((Math.random() * 34) + 1);
      const dishName = faker.lorem.word();
      const price = (Math.random() * 50 + 1).toFixed(2);
      const numberOfPhotos = createNumber(1, maximumPhotosPerDish);
      const numberOfReviews = createNumber(1, maximumReviewsPerDish);
      // create random image variable
      const dishString = `${restaurantIndex}, ${dishName}, ${price}, ${numberOfPhotos}, ${numberOfReviews}`;
      if (!dishesStream.write(`${dishString}\n`)) {
        console.log('========> Error! creating dishes at restaurantIndex: ', restaurantIndex, ' dishIndex: ', dishIndex);
        return;
      }
      dishIndex += 1;
    }
    restaurantIndex -= 1;
  }
  dishesStream.end(() => {
    console.log(`=============> Success generating dishes for restaurant ${restaurantIndex}`);
  });
};

const createRestaurantNamesCSV = () => {
  while (restaurantIndex < numberOfRestaurants) {
    if (!restaurantStream.write(`${faker.company.companyName()}\n`)) {
      console.log('========> Error! creating restaurants at restaurantIndex: ', restaurantIndex, ' dishIndex: ', dishIndex);
      return;
    }
    restaurantIndex += 1;
  }
  restaurantStream.end(() => {
    console.log(`=============> Success generating restaurants ${restaurantIndex}`);
    createDishesDataCSV();
  });
};

restaurantStream.on('drain', () => {
  restaurantIndex += 1;
  console.log('===========> restarting restaurant name generator');
  createRestaurantNamesCSV();
});

dishesStream.on('drain', () => {
  dishIndex += 1;
  console.log('===========> restarting dishes generator');
  createDishesDataCSV();
});

createRestaurantNamesCSV();
