const fs = require('fs');
const faker = require('faker');
const path = require('path');
const { sprintf } = require('sprintf-js');

const restaurantStream = fs.createWriteStream(path.join(__dirname, './data/restaurants.csv'));
const dishesStream = fs.createWriteStream(path.join(__dirname, './data/dishes.csv'));
const reviewsStream = fs.createWriteStream(path.join(__dirname, './data/reviews.csv'));
const imageStream = fs.createWriteStream(path.join(__dirname, './data/images.csv'));

restaurantStream.write('restaurant_name\n');
dishesStream.write('restaurant_id, dish_name, price, number_of_photos, number_of_reviews\n');
reviewsStream.write('dish_id, review_text\n');
imageStream.write('dish_id, image_url\n');

/* ==============================>>>>>>>>>> Constraints <<<<<<<<<<============================== */

/* ======>>>>>> normal restaurant <<<<<<======= */

const numberOfRestaurants = 100000;
const maximumDishesPerRestaurant = 20;
const minimumDishesPerRestaurant = 3;
const maximumImagesPerDish = 5;
const minimumImagesPerDish = 1;
const maximumReviewsPerDish = 5;
const minimumReviewsPerDish = 0;
const availableImages = 499;

/* ======>>>>>> popular restaurant <<<<<<======= */

const fractionOfRestuarants = 10;
const maximumImagesPerDishPopularRestuarant = 40;
const minimumImagesPerDishPopularRestuarant = 5;
const maximumReviewsPerDishPopularRestuarant = 40;
const minimumReviewsPerDishPopularRestuarant = 5;


/* ==============================>>>>>>>>>> Constraints <<<<<<<<<<============================== */

let restaurantIndex = 0;
let dishIndex;
let dishCounter = 0;
let reviewDishCounter = 0;
let imageDishCounter = 0;

const createNumber = (min, max) => Math.floor(Math.random() * (max - min) + min);
const checkIfPopularRestaurant = index => index % fractionOfRestuarants === 0;

const createDishImagesCSV = () => {
  let numberOfImages;
  while (imageDishCounter < dishCounter) {
    if (checkIfPopularRestaurant(imageDishCounter)) {
      numberOfImages = createNumber(minimumImagesPerDishPopularRestuarant,
        maximumImagesPerDishPopularRestuarant);
    } else {
      numberOfImages = createNumber(minimumImagesPerDish, maximumImagesPerDish);
    }
    while (numberOfImages > 0) {
      const imageNumber = sprintf('%04s', createNumber(0, availableImages));
      const image = `${imageDishCounter}, https://s3-us-west-1.amazonaws.com/pley-dish-images/${imageNumber}.jpg`;
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
  let numberOfReviews;
  while (reviewDishCounter < dishCounter) {
    if (checkIfPopularRestaurant(reviewDishCounter)) {
      numberOfReviews = createNumber(minimumReviewsPerDishPopularRestuarant,
        maximumReviewsPerDishPopularRestuarant);
    } else {
      numberOfReviews = createNumber(minimumReviewsPerDish, maximumReviewsPerDish); 
    }
    while (numberOfReviews > 0) {
      const review = faker.lorem.sentences();
      if (!reviewsStream.write(`${reviewDishCounter}, ${review}\n`)) {
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
      const dishName = faker.lorem.words();
      const price = (Math.random() * 50 + 1).toFixed(2);
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
    if (!restaurantStream.write(`${faker.company.companyName()}\n`)) {
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
  restaurantIndex += 1;
  createRestaurantNamesCSV();
});

dishesStream.on('drain', () => {
  dishIndex += 1;
  createDishesDataCSV();
});

reviewsStream.on('drain', () => {
  reviewDishCounter += 1;
  createDishReviewsCSV();
});

imageStream.on('drain', () => {
  imageDishCounter += 1;
  createDishImagesCSV();
});

createRestaurantNamesCSV();
