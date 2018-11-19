const fs = require('fs');
const faker = require('faker');
const path = require('path');
const { sprintf } = require('sprintf-js');
const cassandra = require('cassandra-driver');
// const client = require('./cassandraScript.js');

// const stream = fs.createWriteStream(path.join(__dirname, './data/noSqlData/nosql.json'));


const client = new cassandra.Client({contactPoints: ['127.0.0.1:9042']});

const keyspace = "CREATE KEYSPACE IF NOT EXISTS test2 WITH REPLICATION = {'class': 'SimpleStrategy', 'replication_factor': 3}";
const image = "CREATE TYPE IF NOT EXISTS image (user_name text, url text, date timestamp)";
const review = "CREATE TYPE IF NOT EXISTS review (user_name text, review_text text, date timestamp)";
const dish = "CREATE TYPE IF NOT EXISTS dish (dish_name text, dish_price decimal, dish_reviews list<FROZEN <review>>, dish_images list<FROZEN <image>>)";
const restaurant = "CREATE TABLE IF NOT EXISTS restaurants (id int, restaurant_name text, dishes list<FROZEN <dish>>, PRIMARY KEY(id, restaurant_name))";

/* ==============================>>>>>>>>>> Constraints <<<<<<<<<<============================== */

const numberOfRestaurants = 10000000;
const maximumDishesPerRestaurant = 10;
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
  maximumReviews: 10,
  minimumImages: 5,
  maximumImages: 10,
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
let imageIndex = 0;
let constraint;

const createNumber = (min, max) => Math.floor(Math.random() * (max - min) + min);
const checkIfPopularRestaurant = index => index % fractionOfRestaurants === 0;
const cleanNameFromApostrophe = name => name.split('').filter(letter => letter !== '\'').join('');

const createJSONData = () => {
  const createDishImage = () => {
    const imageNumber = sprintf('%04s', createNumber(0, availableImages));
    return {
      user_name: cleanNameFromApostrophe(faker.name.findName()),
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
      user_name: cleanNameFromApostrophe(faker.name.findName()),
      review_text: faker.lorem.sentence(),
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

  (function loop() {
    if (restaurantIndex < numberOfRestaurants) {
      if (checkIfPopularRestaurant(restaurantIndex)) {
        constraint = popularRestaurant;
      } else {
        constraint = normalRestaurant;
      }
      let restaurantObject = {
        id: restaurantIndex,
        restaurant_name: cleanNameFromApostrophe(faker.company.companyName()),
        dishes: createDishesArray(),
      };
      restaurantIndex += 1;
      if (restaurantIndex % 100000 === 0) {
        console.log(`Created data for ${restaurantIndex} restaurants`);
      }
      let query = `INSERT INTO test2.restaurants JSON '${JSON.stringify(restaurantObject)}'`
      let promise = new Promise((resolve) => {
        client.execute(query);
        resolve();
      })
      .then(() => loop());
    }

  })();
};

client.execute(keyspace)
  .catch(error => console.log('error creating keyspace', error))
  .then(() => client.execute('USE test2'))
  .then(() => client.execute(image))
  .then(() => client.execute(review))
  .then(() => client.execute(dish))
  .then(() => client.execute(restaurant))
  .then(() => createJSONData())



// console.log(`=========>>> Success generating data for ${restaurantIndex} restaurants`);
// process.exit();

// stream.write(']');
