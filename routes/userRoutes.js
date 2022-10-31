

const express = require('express');
const { signup } = require('../controllers/authControllers');
const userController = require("./../controllers/userControllers");
const authController = require("./../controllers/authControllers");



const router = express.Router();

router.post('/signup',signup);

router.post('/signup',authController.signup);
router.post('/login',authController.login);



router
    .route('/')
    .get(userController.getALLusers)
    .post(userController.createUser);

router
    .route('/:id')
    .get(userController.getUser)
    .delete(userController.deleteUser)
    .patch(userController.updateUser);

module.exports = router