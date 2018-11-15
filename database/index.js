const mysql = require('mysql');

const DBconnection = mysql.createConnection({
  database: 'yumpSF',
  user: 'root',
});

const getRestaurantDishes = (restaurantID, callback) => {
  const queryStr = `SELECT * FROM restaurants INNER JOIN dishes ON (id = restaurant_id) WHERE id = ${restaurantID}`;
  DBconnection.query(queryStr, (error, result) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, result);
    }
  });
};

const addRestaurant = (names, callback) => {
  const values = [names.map(name => [name])];
  DBconnection.query('INSERT INTO restaurants (restaurant_name) VALUES ?', values, (error, result) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, result);
    }
  });
};

const addDishes = (dishesData, callback) => {
  const values = [dishesData.map(dish => [dish.restaurant_id,
    dish.dish_name,
    dish.price,
    dish.photo_url,
    dish.number_of_photos,
    dish.number_of_reviews])];
  DBconnection.query('INSERT INTO dishes (restaurant_id, dish_name, price, photo_url, number_of_photos, number_of_reviews) VALUES ?', values, (error, result) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, result);
    }
  });
};

const getDishes = (restaurantName, callback) => {
  const queryStr = 'SELECT * from dishes WHERE restaurant_id IN (SELECT restaurant_id from restaurants where name = ?)';
  DBconnection.query(queryStr, restaurantName, (error, result) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, result);
    }
  });
};

const updateDish = (dishID, dishData, callback) => {
  const values = Object.keys(dishData).map(key => dishData[key]);
  console.log(values);
  const queryStr = `UPDATE dishes SET price = ?, photo_url = ?, number_of_photos = ?, number_of_reviews = ? WHERE dish_id = ${dishID}`;
  DBconnection.query(queryStr, values, (error, result) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, result);
    }
  });
};

const deleteDish = (dishID, callback) => {
  const queryStr = 'DELETE DROM dishes WHERE dish_id = ?)';
  DBconnection.query(queryStr, dishID, (error, result) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, result);
    }
  });
};

module.exports = {
  getRestaurantDishes,
  addDishes,
  addRestaurant,
  getDishes,
  updateDish,
  deleteDish,
};
