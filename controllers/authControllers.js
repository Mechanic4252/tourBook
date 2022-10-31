const User = require("../models/userModel");
const mongoose = require("mongoose");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const AppError = require("./../utils/appError");

const createToken = (user)=>{
    return jwt.sign({id: user._id},process.env.PRIVATE_KEY,{
        expiresIn:process.env.TIME_OUT
    })
}

exports.signup =catchAsync(async (req,res,next)=>{
    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
});

    const token = createToken(user);
    res.status(201).json({
        status:"Success",
        token,
        data:{
            user:user
        }
    }); 
});

exports.login =catchAsync(async (req,res,next)=>{

    const {email, password} = req.body;

    if(!email || !password){
        return next(new AppError("Provide email and password correctly"));
    }

    const user= await User.findOne({email}).select('+password');
    console.log(user);
    if(!user || !(await user.checkPassword(password,user.password))){
        return next(new AppError("Wrong Email Or Password"));
    }

    const token=createToken(user);
    res.status(200).json({
        status:"success",
        token
    })


});