const newRelic = require('newrelic');
const morgan = require('morgan');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const redis = require('redis');
const mongoController = require('../database/mongoDB/mongoController.js');

const redisClient = redis.createClient({
  port: 6379,
  host: '18.188.183.228',
});

redisClient.on('connect', () => {
  console.log('=========> connected to Redis');
});


const app = express();

const PORT = 8080;

app.use(morgan('dev'));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/loaderio-225c4bc8e06e7988218f2e681e379f05/', (req, res) => {
  res.sendfile(path.join(__dirname, '../public', 'loaderVerification.txt'));
});

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '../public')));

app.get('/api/:restaurantID/menu', (req, res) => {
  const { restaurantID } = req.params;
  redisClient.get(restaurantID, (redisError, redisResult) => {
    if (redisError || redisResult === null) {
      mongoController.findRestaurantById(restaurantID, (mongoError, mongoResult) => {
        if (mongoError) {
          res.status(404).send(mongoError);
        } else {
          redisClient.set(restaurantID, JSON.stringify(mongoResult), redis.print);
          res.status(200).send(mongoResult);
        }
      });
    } else {
      res.status(200).send(JSON.parse(redisResult));
    }
  });
});

// app.post('/:restaurantName/:restaurantID/menu', (req, res) => {
//   const { restaurantName, restaurantID } = req.params;
//   const restaurantData = req.body;
//   const dishesData = Object.assign(restaurantData, { restaurantID });
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
