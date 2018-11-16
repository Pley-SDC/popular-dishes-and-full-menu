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
  photo_url VARCHAR(200) NOT NULL,
  number_of_photos INTEGER NOT NULL,
  number_of_reviews INTEGER NOT NULL,
  FOREIGN KEY (restaurant_id) REFERENCES
    restaurants (id)
);
