DROP DATABASE IF EXISTS yumpSF;

CREATE DATABASE yumpSF;

USE yumpSF;

CREATE TABLE restaurants (
  id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY,
  restaurant_name TEXT NOT NULL 
);

CREATE TABLE dishes (
  dish_id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY,
  restaurant_id INTEGER NOT NULL,
  dish_name TEXT NOT NULL,
  price DECIMAL(5,2) NOT NULL,
  FOREIGN KEY (restaurant_id) REFERENCES
    restaurants (id)
);

CREATE TABLE dish_reviews (
  review_id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY,
  dish_id INTEGER NOT NULL,
  review VARCHAR(1000) NOT NULL,
  FOREIGN KEY (dish_id) REFERENCES
    dishes (dish_id)
);

CREATE TABLE dish_photos (
  photo_id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY,
  dish_id INTEGER NOT NULL,
  photo_url VARCHAR(600) NOT NULL,
  FOREIGN KEY (dish_id) REFERENCES
    dishes (dish_id)
);

