const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const DBconnection = require('../database/index.js');

const app = express();

const PORT = 3004;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '../public')));

app.get('/:restaurantName/:restaurantID/menu', (req, res) => {
  const { restaurantName, restaurantID } = req.params;
  console.log(`GET request received for restaurantName: ${restaurantName}, restaurantID: ${restaurantID}`);
  DBconnection.getRestaurantDishes(restaurantID, (error, result) => {
    if (error) {
      res.status(404).send(error);
    } else {
      res.status(200).send(result);
    }
  });
});

app.post('/:restaurantName/:restaurantID/menu', (req, res) => {
  const { restaurantName, restaurantID } = req.params;
  const restaurantData = req.body;
  const dishesData = Object.assign(restaurantData, { restaurantID });
  console.log(`POST request received for restaurantName: ${restaurantName}, restaurantID: ${restaurantID} with ${JSON.stringify(restaurantData)}`);
  DBconnection.addDishes([dishesData], (error) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(201).end();
    }
  });
});

app.put('/:restaurantName/:restaurantID/menu', (req, res) => {
  const { restaurantName, restaurantID } = req.params;
  const restaurantData = req.body;
  console.log(`PUT request received for restaurantName: ${restaurantName}, restaurantID: ${restaurantID} with ${JSON.stringify(restaurantData)}`);
  res.status(201).end();
  // Database query to create new restaurant with attached data
});

app.delete('/:restaurantName/:restaurantID/menu', (req, res) => {
  const { restaurantName, restaurantID } = req.params;
  console.log(`DELETE request received for restaurantName: ${restaurantName}, restaurantID: ${restaurantID}`);
  res.status(204).end();
  // Database query to delete restaurant
});

app.listen(PORT, () => {
  console.log(`===========> listening on PORT ${PORT}`);
});
