const faker = require('faker');
const DBconnection = require('./index');

const seedDatabase = (quantity) => {
  const restaurantNames = [];
  const dishesData = [];

  const createRestaurantNames = () => {
    for (let i = 0; i < quantity; i += 1) {
      restaurantNames.push(faker.company.companyName());
    }
  };

  const createDishesData = () => {
    for (let i = 1; i <= quantity; i += 1) {
      for (let j = 0; j < 15; j += 1) {
        const jpegNumber = Math.floor((Math.random() * 34) + 1);
        const dishObject = {
          restaurant_id: i,
          dish_name: faker.lorem.word(),
          price: (Math.random() * 49 + 1).toFixed(2),
          photo_url: `https://s3.us-east-2.amazonaws.com/yumpsfphotos/${jpegNumber}.jpeg`,
          number_of_photos: Math.floor((Math.random() * 60) + 1),
          number_of_reviews: Math.floor((Math.random() * 100) + 1),
        };
        dishesData.push(dishObject);
      }
    }
  };

  createRestaurantNames();
  createDishesData();

  DBconnection.addRestaurant(restaurantNames, (error) => {
    if (error) {
      console.log('========> Error adding restaurants to database: ', error);
    } else {
      console.log('========> Success adding restaurants to database');
    }
  });

  DBconnection.addDishes(dishesData, (error) => {
    if (error) {
      console.log('========> Error adding dishes to database: ', error);
      process.exit();
    } else {
      console.log('========> Success adding dishes to database: ');
      process.exit();
    }
  });
};

seedDatabase(100);
