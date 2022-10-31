const express = require('express');
const tourController = require("./../controllers/tourControllers");

const router = express.Router();


//parameter middleware
/*
router.param("id",(req,res,next,val)=>{
    console.log(`Tour id is ${val}`);
    next()
})*/
router.route('/top-5-cheap').get(tourController.topTours,tourController.getALLtours)
router.route('/tour-stats').get(tourController.getToursStats);
router.route('/').get(tourController.getALLtours).post(tourController.postTours);
router.route('/:id').get(tourController.getOneTour).post(tourController.updateTour).delete(tourController.deleteTour);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

module.exports = router;