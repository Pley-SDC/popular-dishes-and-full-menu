const DBConnection = require('./indexMongoDB');

const findRestaurantById = (_id, callback) => {
  DBConnection.Restaurant.findOne({ _id }, (error, results) => {
    if (error) {
      // console.log('error', error);
      callback(error);
    } else {
      // console.log('received', results);
      callback(null, results);
    }
  });
};

const addDish = (_id, dishObject) => {
  DBConnection.Restaurant.find({ _id }, (error, results) => {
    if (error) {
      console.log('error', error);
    } else {
      const { dishes } = results[0];
      dishes.push(dishObject);
      DBConnection.Restaurant.updateOne({ _id }, { dishes }, (error) => {
        if (error) {
          console.log(error);
        }
      });
    }
  });
};


module.exports = {
  findRestaurantById,
  addDish,
};

// const dishObject = {dish_name:"et autem qui",dish_price:47.68,dish_reviews:[{user_name:"Jeffry Trantow",review_text:"Aut repellendus voluptatem.",date:"2018-01-25T07:58:43.441Z"},{user_name:"Niko Strosin",review_text:"Velit molestiae cum.",date:"2018-01-09T18:29:33.844Z"},{user_name:"Marina Yost",review_text:"Similique dolorem porro earum explicabo explicabo inventore eos.",date:"2018-10-05T12:15:40.665Z"},{user_name:"Vivien Goodwin",review_text:"Nam ipsum tenetur omnis at quidem qui qui exercitationem eos.",date:"2018-05-19T01:15:54.288Z"},{user_name:"Karl Ullrich",review_text:"Neque error sed eos molestias qui quisquam est voluptate.",date:"2018-06-12T15:33:47.514Z"}],dish_images:[{user_name:"Freddy Monahan",url:"https://s3-us-west-1.amazonaws.com/pley-dish-images/0073.jpg",date:"2018-02-07T17:40:20.668Z"}]};
