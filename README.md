# YumpSF popular-dishes-and-full-menu Module

> Module displays carousel of top 10 most popular dishes for the given restaurant with image and stats like price and number of reviews from users that mention the dish. Clicking on the Full Menu displays the Full Menu of all dishes for the restaurant. 

## Related Projects
  - https://github.com/Pley-SDC/reservation
  - https://github.com/Pley-SDC/Recommended-Reviews-Module
  - https://github.com/Pley-SDC/overview

## Table of Contents
1. [Setup](#Setup)
2. [Requirements](#requirements)
3. [Development](#development)

## Setup
 - npm install
 - npm run react-dev to run webpack
 - npm start to run server

## Requirements
- Node 6.13.0 and additional requirements in package.json file -- to be installed with npm install 
- mySql database 

### Installing Dependencies

From within the root directory:
npm install -g webpack
npm install

## Running Tests
- npm test to run jest unit test suite for all components 

## CRUD

| Command | Method | Endpoint | Body | Purpose |
| ------- | ------ | -------- | ---- | ------- |
| Create | POST | '/restaurants/:restaurantName/:restaurantID/menu' | JSON | Add new restaurant to platform |
| Read | GET | '/restaurants/:restaurantName/:restaurantID/menu' | none | Get data for given restaurant (defined in endpoint) |
| Update | PUT | '/restaurants/:restaurantName/:restaurantID/menu' | JSON | Update restaurants information |
| Delete | DELETE | '/restaurants/:restaurantName/:restaurantID/menu' | none | Delete restaurant from platform |

## Acknowledgements
- Thanks to everyone on the YumpSF team for builing awesome modules that bring to life the YumpSF verison of the Yelp restaurant page user experience! 

