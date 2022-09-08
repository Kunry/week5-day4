const router = require('express').Router();
const RestaurantModel = require('../models/restaurant.model');

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

// router.get('/restaurants/api', (req, res, next) => {
//   RestaurantModel.find()
//     .then((restaurants) => {
//       res.json(restaurants);
//     })
//     .catch((err) => {
//       next(err);
//     });
// });

router.get('/restaurants/api', async (req, res, next) => {
  try {
    const restaurants = await RestaurantModel.find();
    res.json(restaurants);
  } catch(err) {
    next(err);
  }
});

// POST
router.post('/', (req, res, next) => {
  const { longitude, latitude, name, description } = req.body;

  const newRestaurant = new RestaurantModel({
    name,
    description,
    location: {
      type: 'Point',
      coordinates: [longitude, latitude],
    },
  });

  newRestaurant
    .save()
    .then((restaurant) => {
      res.redirect('/');
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;
