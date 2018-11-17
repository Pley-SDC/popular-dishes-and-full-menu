const fs = require('fs');
const faker = require('faker');
const path = require('path');
const { sprintf } = require('sprintf-js');

const stream = fs.createWriteStream(path.join(__dirname, './data/noSqlData/nosql.json'));

/* ==============================>>>>>>>>>> Constraints <<<<<<<<<<============================== */

const numberOfRestaurants = 2;
const maximumDishesPerRestaurant = 20;
const minimumDishesPerRestaurant = 3;
const availableImages = 499;
const maximumDishPrice = 50;
const minimumDishPrice = 10;

/* ======>>>>>> popular restaurant <<<<<<======= */

const fractionOfRestaurants = 10;
const normalRestaurant = {
  minimumReviews: 0,
  maximumReviews: 5,
  minimumImages: 0,
  maximumImages: 5,
};

const popularRestaurant = {
  minimumReviews: 5,
  maximumReviews: 40,
  minimumImages: 5,
  maximumImages: 40,
};


/* ==============================>>>>>>>>>> Constraints <<<<<<<<<<============================== */

/* ==============================>>>>>>>>>> Data shape <<<<<<<<<<==============================

{
  restaurant_name: string,
  dishes: [{
    dish_name: string,
    dish_price: integer,
    dish_reviews: [{
      user_name: string,
      review_text: string,
      date: date,
    }],
    dish_images: [{
      user_name: string,
      url: string,
      date: date
    }]
  }]
}

 ==============================>>>>>>>>>> Data shape <<<<<<<<<<============================== */

let restaurantIndex = 0;
let dishIndex = 0;

let reviewIndex = 0;
let imageIndex = 0;
let constraint;

const createNumber = (min, max) => Math.floor(Math.random() * (max - min) + min);
const checkIfPopularRestaurant = index => index % fractionOfRestaurants === 0;

const createJSONData = () => {
  const createDishImage = () => {
    const imageNumber = sprintf('%04s', createNumber(0, availableImages));
    return {
      user_name: faker.name.findName(),
      url: `${imageIndex}, https://s3-us-west-1.amazonaws.com/pley-dish-images/${imageNumber}.jpg`,
      date: faker.date.past(),
    };
  };

  const createDishImagesArray = () => {
    const numberOfImages = createNumber(constraint.minimumImages, constraint.maximumImages);
    const imagesArray = [];
    while (imagesArray < numberOfImages) {
      imagesArray.push(createDishImage());
      imageIndex += 1;
    }
    imageIndex = 0;
    return imagesArray;
  };

  const createDishReview = () => {
    return {
      user_name: faker.name.findName(),
      review_text: faker.lorem.sentences(),
      date: faker.date.past(),
    };
  };

  const createDishReviewsArray = () => {
    const numberOfReviews = createNumber(constraint.minimumReviews, constraint.maximumReviews);
    const reviewsArray = [];
    while (reviewIndex < numberOfReviews) {
      reviewsArray.push(createDishReview());
      reviewIndex += 1;
    }
    reviewIndex = 0;
    return reviewsArray;
  };

  const createDish = () => {
    return {
      dish_name: faker.lorem.words(),
      dish_price: (Math.random() * (maximumDishPrice - minimumDishPrice) + minimumDishPrice)
        .toPrecision(4),
      dish_reviews: createDishReviewsArray(),
      dish_images: createDishImagesArray(),
    };
  };

  const createDishesArray = () => {
    const numberOfDishes = createNumber(minimumDishesPerRestaurant, maximumDishesPerRestaurant);
    const dishesArray = [];
    while (dishIndex < numberOfDishes) {
      dishesArray.push(createDish());
      dishIndex += 1;
    }
    dishIndex = 0;
    return dishesArray;
  };

  while (restaurantIndex < numberOfRestaurants) {
    if (checkIfPopularRestaurant(restaurantIndex)) {
      constraint = popularRestaurant;
    } else {
      constraint = normalRestaurant;
    }
    const restaurantObject = {
      restaurant_name: faker.company.companyName(),
      dishes: createDishesArray(),
    };
    restaurantIndex += 1;
    if (restaurantIndex % 100000 === 0) {
      console.log(`Created data for ${restaurantIndex} restaurants`);
    }
    if (!stream.write(JSON.stringify(restaurantObject))) {
      return;
    }
  }
};

stream.on('drain', () => {
  createJSONData();
});

createJSONData();
