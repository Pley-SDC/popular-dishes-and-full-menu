const fs = require('fs');
const faker = require('faker');
const path = require('path');
const { sprintf } = require('sprintf-js');

const stream = fs.createWriteStream(path.join(__dirname, './data/nosql.json'));

/* ==============================>>>>>>>>>> Constraints <<<<<<<<<<============================== */

const numberOfRestaurants = 500000;
const maximumDishesPerRestaurant = 20;
const minimumDishesPerRestaurant = 3;
const availableImages = 499;
const maximumDishPrice = 50;
const minimumDishPrice = 10;
const fractionOfPopularRestuarants = 10;

const normalResataurant = {
  minimumReviews: 0,
  maximumReviews: 5,
  minimumImages: 0,
  maximumImages: 5,
}

const popularRestaurant = {
  minimumReviews: 5,
  maximumReviews: 40,
  minimumImages: 5,
  maximumImages: 40,
}


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
let dishIndex;

let reviewDishCounter = 0;
let imageDishCounter = 0;
let constraint;

const createNumber = (min, max) => Math.floor(Math.random() * (max - min) + min);
const checkIfPopularRestaurant = index => index % fractionOfPopularRestuarants === 0;

const createJSONData = () => {

  const createDishesArray = () => {
  const numberOfDishes = createNumber(minimumDishesPerRestaurant, maximumDishesPerRestaurant);
  let dishCounter = 0;
  const dishesArray = [];
  while (dishCounter < numberOfDishes) {
    dishesArray.push(createDish());
    dishCounter += 1;
  }
  return dishesArray;
  }

  const createDish = () => {
    return {
      dish_name: faker.lorem.words(),
      dish_price: (Math.random() * (50 - 10) + 10).toPrecision(4),
      dish_reviews: createDishReviewsArray(),
      dish_images: createDishImagesArray(),
    }
  }

  const createDishReviewsArray = () => {
    const numberOfReviews = createNumber(constraint['minimumReviews'], constraint['maximumReviews']);
    let reviewsCounter = 0;
    let reviewsArray = [];
    while (reviewsCounter < numberOfReviews) {
      reviewsArray.push(createDishReview());
      reviewsCounter += 1;
    }
    return reviewsArray;
  }

  const createDishReview = () => {
    return {
    user_name: faker.name.findName(),
    review_text: faker.lorem.sentences(),
    date: faker.date.past(),
    } 
  }

  const createDishImagesArray = () => {
    const numberOfImages = createNumber(constraint['minimumImages'], constraint['maximumImages']);
    let imagesCounter = 0;
    let imagesArray = [];
    while(imagesArray < numberOfImages) {
      imagesArray.push(createDishImage());
      imagesCounter += 1;
    }
    return imagesArray;
  }

  const createDishImage = () => {
    const imageNumber = sprintf('%04s', createNumber(0, availableImages));
    return {
      user_name: faker.name.findName(),
      url: `${imageDishCounter}, https://s3-us-west-1.amazonaws.com/pley-dish-images/${imageNumber}.jpg`,
      date: faker.date.past(),
    }
  }

  while (restaurantIndex < numberOfRestaurants) {
    if (checkIfPopularRestaurant(imageDishCounter)) {
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
      console.log(`Created data for ${restaurantIndex} restaurants`)
    }
    if (!stream.write(JSON.stringify(restaurantObject))) {
        return;
    }
  }


};

stream.on('drain', () => {
  restaurantIndex += 1;
  createJSONData();
});

createJSONData();



