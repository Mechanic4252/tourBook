const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,'A tour must have a name'],
        unique: true
    },
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration']
    },
    maxGroupSize:{
        type: Number,
        required:[true,'A tour must have duration']
    },
    difficulty:{
        type: String,
        required: [true,'A tour must have difficulty'],
        enum: ["easy","difficult","medium"]
    },
    ratingsQuantity:{
        type: Number,
        default: 0
    },
    ratingsAverage: {
        type:Number,
        default: 0.0
    },
    price: {
       type: Number,
       required: [true,'A tour must have a type']
    },
    priceDiscount:{
        type: Number
    },
    summary:{
        type:String,
        trim: true,
        required: [true,'A tour must have a description']
    },
    description:{
        type:String,
        trim: true,
    },
    imageCover:{
        type: String,
        required:[true,'A tour must have image']
    },
    images: [String],
    createdAt:{
        type: Date,
        default: Date.now(),
        select: false
    },
    startDates:{
        type: [Date]
    }
},{
    toJSON:{ virtuals: true},
    toObject:{virtuals:true}
});

tourSchema.virtual('durationWeeks').get(function() {
    return this.duration/7;
});

// DOCUMENT MIDDLEWARE; runs before .save() and create() command
tourSchema.pre('save',function() {
    console.log(this);
})


const Tour = mongoose.model('Tour',tourSchema);

/*const testTour = new Tour({
    name: 'Forest Hiker',
    rating: 4.8,
    price: 497
});

testTour.save().then((doc)=>{
    console.log("Successfully saved");
    console.log(doc);
}).catch(err=>{
    console.log("Some error occured in saving the document...");
})*/

module.exports = Tour;