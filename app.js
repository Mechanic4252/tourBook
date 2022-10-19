const express = require("express");
const fs = require("fs");

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController')
const tourRouter = require('./routes/tourRoutes');
const userRouter = require("./routes/userRoutes");

const app = express();
//middleware-1
app.use(express.json());
//middleware-2
// app.use((req,res,next)=>{
//     console.log("Middleware-2");
//     next();
// })
//middleware-3
app.use((req,res,next)=>{
    req.requestTime = new Date().toISOString();
    next();
})
//tours get API
/*app.get('/api/v1/tours',getALLtours)
//tours post API
app.post('/api/v1/tours',postTours)
//Single tour information API
//to declare optional parameters in api '?' is used insted of ':'
app.get('/api/v1/tours/:id',getOneTour)*/

//middleware-4
app.use('/api/v1/tours',tourRouter);
app.use('/api/v1/users',userRouter);

app.all('*',(req,res,next)=>{
    //const err = new Error(`can't find ${req.originalUrl} on server....`);
    //err.status = 'fail';
    //err.statusCode = 404;
    next(new AppError((`can't find ${req.originalUrl} on server....`),404));
});



app.use(globalErrorHandler);


module.exports = app;