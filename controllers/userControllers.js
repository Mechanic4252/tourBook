const catchAsync = require("./../utils/catchAsync");
const user = require("./../models/userModel");
const apiFeatures = require("./../utils/apiFeatures");
const AppError = require("../utils/appError");



//const users=JSON.parse(fs.readFileSync('./dev-data/data/users.json'));



exports.getALLusers = catchAsync(async (req,res,next)=>{
    const feature = new apiFeatures(user.find(),req.query).filter().sort().limit().paginate();

    const users = await feature.query;

    res.status(200).json({
        status:"success",
        length:users.length,
        Users:users
    })
});

exports.createUser= catchAsync(async (req,res,next)=>{
    

    res.status(201).json({
        status:"success",
        data:{
            users:newUser
        }
    })
});

exports.getUser =catchAsync(async (req,res,next)=>{
    const User = await user.findById(req.params.id);

    if(!User){
        return next(new AppError("No user with that ID",404));
    }

    res.status(201).json({
        status:"Success",
        User
    })

});

exports.deleteUser= catchAsync(async (req,res,next)=>{
    const User = await user.findByIdAndDelete(req.params.id);
        
        if(!User) {
            return next(new AppError("No user found with that ID",404))
        }

        res.status(204).json({
            status:"success",
            description:"User deleated successfully"
        })

});

exports.updateUser = catchAsync(async (req,res,next)=>{

    const User = await user.findByIdAndUpdate(req.params.id,req.body);

    if(!User){
        return next(new AppError("No user with that id",404));
    }

    res.status(201).json({
        status:"Updated SuccessFully",
        User
    })

});
