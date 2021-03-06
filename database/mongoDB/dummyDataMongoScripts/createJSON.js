const fs = require('fs');
const faker = require('faker');
const path = require('path');
const { sprintf } = require('sprintf-js');

const stream = fs.createWriteStream(path.join(__dirname, '../data/nosqlRestaurants.json'));

/* ==============================>>>>>>>>>> Constraints <<<<<<<<<<============================== */

const numberOfRestaurants = 10000000;
const maximumDishesPerRestaurant = 7;
const minimumDishesPerRestaurant = 5;
const availableImages = 499;
const maximumDishPrice = 50;
const minimumDishPrice = 10;

/* ======>>>>>> popular restaurant <<<<<<======= */

const fractionOfRestaurants = 10;
const normalRestaurant = {
  minimumReviews: 0,
  maximumReviews: 3,
  minimumImages: 1,
  maximumImages: 3,
};

const popularRestaurant = {
  minimumReviews: 4,
  maximumReviews: 7,
  minimumImages: 4,
  maximumImages: 7,
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

let restaurantIndex = 1;
let dishIndex = 0;

let reviewIndex = 0;
let constraint;
let imageNumber;
let numberOfImages;
let imagesArray;
let numberOfReviews;
let reviewsArray;
let numberOfDishes;
let dishesArray;
let restaurantObject;

const createNumber = (min, max) => Math.floor(Math.random() * (max - min) + min);
const checkIfPopularRestaurant = index => index % fractionOfRestaurants === 0;
const cleanNameFromApostrophe = name => name.split('').filter(letter => letter !== '\'').join('');

const createJSONData = () => {
  const createDishImage = () => {
    imageNumber = sprintf('%04s', createNumber(0, availableImages));
    return {
      image_id: imagesArray.length,
      user_name: cleanNameFromApostrophe(faker.name.findName()),
      url: `https://s3-us-west-1.amazonaws.com/pley-dish-images/${imageNumber}.jpg`,
      date: faker.date.past(),
    };
  };

  const createDishImagesArray = () => {
    numberOfImages = createNumber(constraint.minimumImages, constraint.maximumImages);
    imagesArray = [];
    while (imagesArray.length < numberOfImages) {
      imagesArray.push(createDishImage());
    }
    return imagesArray;
  };

  const createDishReview = () => {
    return {
      review_id: reviewIndex,
      user_name: cleanNameFromApostrophe(faker.name.findName()),
      review_text: faker.lorem.sentence(),
      date: faker.date.past(),
    };
  };

  const createDishReviewsArray = () => {
    numberOfReviews = createNumber(constraint.minimumReviews, constraint.maximumReviews);
    reviewsArray = [];
    while (reviewIndex < numberOfReviews) {
      reviewsArray.push(createDishReview());
      reviewIndex += 1;
    }
    reviewIndex = 0;
    return reviewsArray;
  };

  const createDish = () => {
    return {
      dish_id: dishIndex,
      dish_name: faker.lorem.word(),
      dish_description: faker.lorem.words(),
      dish_price: (Math.random() * (maximumDishPrice - minimumDishPrice) + minimumDishPrice)
        .toPrecision(4),
      dish_reviews: createDishReviewsArray(),
      dish_images: createDishImagesArray(),
    };
  };

  const createDishesArray = () => {
    numberOfDishes = createNumber(minimumDishesPerRestaurant, maximumDishesPerRestaurant);
    dishesArray = [];
    while (dishIndex < numberOfDishes) {
      dishesArray.push(createDish());
      dishIndex += 1;
    }
    dishIndex = 0;
    return dishesArray;
  };

  while (restaurantIndex <= numberOfRestaurants) {
    if (checkIfPopularRestaurant(restaurantIndex)) {
      constraint = popularRestaurant;
    } else {
      constraint = normalRestaurant;
    }
    restaurantObject = {
      _id: restaurantIndex,
      restaurant_name: cleanNameFromApostrophe(faker.company.companyName()),
      dishes: createDishesArray(),
    };
    restaurantIndex += 1;
    if (restaurantIndex % 100000 === 0) {
      console.log(`Created data for ${restaurantIndex} restaurants`);
    }
    if (!stream.write(`${JSON.stringify(restaurantObject)}`)) {
      return;
    }
  }
  stream.end(() => console.log(`=========>>> Success generating data for ${restaurantIndex} restaurants`));
};

stream.on('drain', () => {
  createJSONData();
});

createJSONData();

// stream.write(']');
