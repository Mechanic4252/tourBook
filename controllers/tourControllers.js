
const AppError = require("../utils/appError");
const Tour = require("./../models/tourModel")
const apiFeatures = require("./../utils/apiFeatures")
const catchAsync = require("./../utils/catchAsync")



exports.getALLtours = catchAsync(async (req,res,next)=>{
    //mongoose document reading
    const features = new apiFeatures(Tour.find(),req.query).filter().sort().limit().paginate();
        const tours = await features.query;
        //SEND RESPONSE
        res.status(200).json({
            status: "Success",
            result: tours.length,
            data: {
                tours: tours
            }
        })
    
    
})

exports.postTours =catchAsync( async (req,res,next)=>{

    //var newId=tours[tours.length-1]+1;
    //const newTour = Object.assign({id:newId},req.body);

    //tours.push(newTour);
    
    //Mongoose document creation
    const newTour = await Tour.create(req.body);
    res.status(201).json({
        status:"success",
        message: "file updated successfully",
        tour: newTour
    });
})

exports.getOneTour =catchAsync( async (req,res,next)=>{
    //console.log(req.params);
    //if(req.params.id>tours.length){
    //    res.status(404).send("Error!!! tour not found");
    //}
    //else{
    //Mongoose getting required document
    
        const tour=await Tour.findById(req.params.id);

        if(!tour) {
            return next(new AppError("No tour found with that ID",404))
        }

        res.status(200).json({
            status:"success",
            tour: tour
        });
    
    //}
})

exports.updateTour =catchAsync( async (req,res,next)=>{
    
        const tour= await Tour.findByIdAndUpdate(req.params.id,req.body,{
            new: true,
            runValidators: true
        });

        if(!tour) {
            return next(new AppError("No tour found with that ID",404))
        }

        res.status(200).json({
            status: 'success',
            data: {
                tour: tour
            }
        })
})

exports.deleteTour =catchAsync( async (req,res,next) =>{
    
        const tour = await Tour.findByIdAndDelete(req.params.id);
        
        if(!tour) {
            return next(new AppError("No tour found with that ID",404))
        }

        res.status(204).json({
            status:"success",
            description:"Tour deleated successfully"
        })
})

/*exports.checkBody = (req,res,next)=>{
    if(!req.body.name || !req.body.price){
        res.status(402).json({
            status:"bad request",
            description:"Trying to post tour without name or price"
        })
    }
    next()
}
*/

exports.topTours = (req,res,next)=>{
    req.query.limit = 5
    req.query.sort = '-ratingsAverage,price';
    next()
}


exports.getToursStats =catchAsync( async (req,res,next) =>{

        const stats =  await Tour.aggregate([
            {
                $match: { ratingsAverage: {$gte: 4.5}}
            },
            {
                $group: {
                    _id:"$difficulty",
                    numTours: {$sum: 1},
                    numRatings: {$sum: '$ratingsQuantity'},
                    avgrating: {$avg:'$ratingsAverage'},
                    avgPrice: {$avg: '$price'},
                    minPrice: {$min:'$price'},
                    maxPrice: {$max: '$price'}
                }
            },
            {
                $sort: {avgPrice: 1}
            }
        ])

        res.status(200).json({
            status: 'success',
            data: {
                tour: stats
            }
        })
})


exports.getMonthlyPlan = catchAsync( async (req,res,next)=>{
        const year = req.params.year*1;
        const plan = await Tour.aggregate([
            {
                $unwind: '$startDates'
            },
            {
                $match: {
                    startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`)
                    }
                }
            },
            {
                $group: {
                    _id: {$month: '$startDates'},
                    numTourStart: {$sum: 1},
                    tours: {$push: '$name'},

                }
            },
            {
                $addFields: { month: '$_id'}
            },
            {
                $project: {
                    _id: 0
                }
            },{
                $sort: {numTourStart: -1}
            }

        ]);
        res.status(200).json({
            status: 'success',
            data: {
                tour: plan
            }
        })
})

