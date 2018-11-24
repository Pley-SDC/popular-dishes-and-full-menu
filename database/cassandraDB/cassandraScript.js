const cassandra = require('cassandra-driver');
const client = new cassandra.Client({contactPoints: ['127.0.0.1:9042']});

const keyspace = "CREATE KEYSPACE IF NOT EXISTS test2 WITH REPLICATION = {'class': 'SimpleStrategy', 'replication_factor': 3}";
const image = "CREATE TYPE IF NOT EXISTS image (user_name text, url text, date timestamp)";
const review = "CREATE TYPE IF NOT EXISTS review (user_name text, review_text text, date timestamp)";
const dish = "CREATE TYPE IF NOT EXISTS dish (dish_name text, dish_price decimal, dish_reviews list<FROZEN <review>>, dish_images list<FROZEN <image>>)";
const restaurant = "CREATE TABLE IF NOT EXISTS restaurants (id int, restaurant_name text, dishes list<FROZEN <dish>>, PRIMARY KEY(id, restaurant_name))";

client.execute(keyspace)
  .catch(error => console.log('error creating keyspace', error))
  .then(() => client.execute('USE test2'))
  .then(() => client.execute(image))
  .then(() => client.execute(review))
  .then(() => client.execute(dish))
  .then(() => client.execute(restaurant))

process.exit();

module.exports.client = client;


