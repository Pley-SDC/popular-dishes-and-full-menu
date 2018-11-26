// const newRelic = require('newrelic');
const morgan = require('morgan');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoController = require('../database/mongoDB/mongoController.js');

const app = express();

const PORT = 3004;

app.use(morgan('dev'));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '../public')));

app.get('/:restaurantName/:restaurantID/menu', (req, res) => {
  const { restaurantName, restaurantID } = req.params;
  // console.log(`GET request received for restaurantName: ${restaurantName}, restaurantID: ${restaurantID}`);
  mongoController.findRestaurantById(restaurantID, (error, result) => {
    if (error) {
      res.status(404).send(error);
    } else {
      res.status(200).send(result);
    }
  });
});

// app.post('/:restaurantName/:restaurantID/menu', (req, res) => {
//   const { restaurantName, restaurantID } = req.params;
//   const restaurantData = req.body;
//   const dishesData = Object.assign(restaurantData, { restaurantID });
//   console.log(`POST request received for restaurantName: ${restaurantName}, restaurantID: ${restaurantID} with ${JSON.stringify(restaurantData)}`);
//   DBconnection.addDishes([dishesData], (error) => {
//     if (error) {
//       console.log(error);
//       res.status(500).send(error);
//     } else {
//       res.status(201).end();
//     }
//   });
// });

// app.put('/:restaurantName/:restaurantID/menu', (req, res) => {
//   const { restaurantName, restaurantID } = req.params;
//   const restaurantData = req.body;
//   const { dishID } = restaurantData;
//   delete restaurantData.dishID;
//   console.log(`PUT request received for restaurantName: ${restaurantName}, restaurantID: ${restaurantID} with ${JSON.stringify(restaurantData)}`);
//   DBconnection.updateDish(dishID, restaurantData, (error) => {
//     if (error) {
//       res.status(500).send(error);
//     } else {
//       res.status(201).end();
//     }
//   });
// });

// app.delete('/:restaurantName/:restaurantID/menu', (req, res) => {
//   const { restaurantName, restaurantID } = req.params;
//   const { dishID } = req.body;
//   console.log(`DELETE request received for restaurantName: ${restaurantName}, restaurantID: ${restaurantID}`);
//   DBconnection.deleteDish(dishID, (error) => {
//     if (error) {
//       console.log(error);
//       res.status(500).send(error);
//     } else {
//       res.status(204).end();
//     }
//   });
// });

app.listen(PORT, () => {
  console.log(`===========> listening on PORT ${PORT}`);
});
