const fs = require('fs');
const faker = require('faker');
const path = require('path');
const { sprintf } = require('sprintf-js');

const restaurantStream = fs.createWriteStream(path.join(__dirname, './data2/restaurants.csv'));
const dishesStream = fs.createWriteStream(path.join(__dirname, './data2/dishes.csv'));
const reviewsStream = fs.createWriteStream(path.join(__dirname, './data2/reviews.csv'));
const imageStream = fs.createWriteStream(path.join(__dirname, './data2/images.csv'));

restaurantStream.write('restaurant_name\n');
dishesStream.write('restaurant_id, dish_name, dish_price\n');
reviewsStream.write('dish_id, user_name, review_text, review_date\n');
imageStream.write('dish_id, user_name, image_url, image_date\n');

/* ==============================>>>>>>>>>> Constraints <<<<<<<<<<============================== */

/* ======>>>>>> normal restaurant <<<<<<======= */

const numberOfRestaurants = 10000000;
const maximumDishesPerRestaurant = 10;
const minimumDishesPerRestaurant = 3;
const availableImages = 499;
const maximumDishPrice = 50;
const minimumDishPrice = 10;

/* ======>>>>>> popular restaurant <<<<<<======= */

const fractionOfRestuarants = 10;
const normalRestaurant = {
  minimumReviews: 0,
  maximumReviews: 3,
  minimumImages: 0,
  maximumImages: 3,
};

const popularRestaurant = {
  minimumReviews: 2,
  maximumReviews: 7,
  minimumImages: 2,
  maximumImages: 7,
};


/* ==============================>>>>>>>>>> Constraints <<<<<<<<<<============================== */

let restaurantIndex = 0;
let dishIndex;
let dishCounter = 0;
let reviewDishCounter = 0;
let imageDishCounter = 0;
let numberOfReviews;
let numberOfImages;
let constraint;

const createNumber = (min, max) => Math.floor(Math.random() * (max - min) + min);
const checkIfPopularRestaurant = index => index % fractionOfRestuarants === 0;
const filterCommas = string => string.split('').filter(letter => letter !== ',').join('');

const createDishImagesCSV = () => {
  while (imageDishCounter < dishCounter) {
    numberOfImages = createNumber(constraint.minimumImages, constraint.maximumImages);
    while (numberOfImages > 0) {
      const imageNumber = sprintf('%04s', createNumber(0, availableImages));
      const userName = faker.name.findName();
      const date = faker.date.past();
      const image = `${imageDishCounter}, ${userName},  https://s3-us-west-1.amazonaws.com/pley-dish-images/${imageNumber}.jpg, ${date}`;
      if (!imageStream.write(`${image}\n`)) {
        return;
      }
      numberOfImages -= 1;
    }
    imageDishCounter += 1;
    if (imageDishCounter % 10000 === 0) {
      console.log(`==========> created images for ${imageDishCounter} dishes`);
    }
  }
  imageStream.end(() => {
    console.log('============> completed creating data');
  });
};

const createDishReviewsCSV = () => {
  while (reviewDishCounter < dishCounter) {
    numberOfReviews = createNumber(constraint.minimumReviews, constraint.maximumReviews);
    while (numberOfReviews > 0) {
      const review = filterCommas(faker.lorem.sentence());
      const userName = faker.name.findName();
      const date = faker.date.past();
      if (!reviewsStream.write(`${reviewDishCounter}, ${userName}, ${review}, ${date}\n`)) {
        return;
      }
      numberOfReviews -= 1;
    }
    reviewDishCounter += 1;
    if (reviewDishCounter % 10000 === 0) {
      console.log(`==========> created reviews for ${reviewDishCounter} dishes`);
    }
  }
  reviewsStream.end(() => {
    createDishImagesCSV();
  });
};

const createDishesDataCSV = () => {
  while (restaurantIndex < numberOfRestaurants) {
    const NumberOfDishes = createNumber(minimumDishesPerRestaurant,
      maximumDishesPerRestaurant);
    dishIndex = 0;
    while (dishIndex < NumberOfDishes) {
      const dishName = faker.lorem.word();
      const price = (Math.random() * (maximumDishPrice - minimumDishPrice) + minimumDishPrice)
        .toPrecision(4);
      const dishString = `${restaurantIndex}, ${dishName}, ${price}`;
      if (!dishesStream.write(`${dishString}\n`)) {
        return;
      }
      dishIndex += 1;
      dishCounter += 1;
    }
    restaurantIndex += 1;
    if (restaurantIndex % 10000 === 0) {
      console.log(`==========> created dishes for ${restaurantIndex} restaurants`);
    }
  }
  dishesStream.end(() => {
    createDishReviewsCSV();
  });
};

const createRestaurantNamesCSV = () => {
  while (restaurantIndex < numberOfRestaurants) {
    if (checkIfPopularRestaurant(restaurantIndex)) {
      constraint = popularRestaurant;
    } else {
      constraint = normalRestaurant;
    }
    if (!restaurantStream.write(`${filterCommas(faker.company.companyName())}\n`)) {
      return;
    }
    restaurantIndex += 1;
    if (restaurantIndex % 100000 === 0) {
      console.log(`==========> created ${restaurantIndex} restaurant names`);
    }
  }
  restaurantStream.end(() => {
    restaurantIndex = 0;
    createDishesDataCSV();
  });
};

restaurantStream.on('drain', () => {
  // restaurantIndex += 1;
  createRestaurantNamesCSV();
});

dishesStream.on('drain', () => {
  // dishIndex += 1;
  createDishesDataCSV();
});

reviewsStream.on('drain', () => {
  // reviewDishCounter += 1;
  createDishReviewsCSV();
});

imageStream.on('drain', () => {
  // imageDishCounter += 1;
  createDishImagesCSV();
});

createRestaurantNamesCSV();
