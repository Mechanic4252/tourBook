const AppError = require("./../utils/appError");

const castingErrorDb=(err)=>{
    const message = `Invalid ${err.path}: ${err.value}.`
    return new AppError(message,400);
}

const handleDuplicateDb=(err)=>{
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Duplicate field value: ${value} .Use another name.`
    return new AppError(message,400);
}

const sendDevError = (err,res)=>{
    res.status(err.statusCode).json({
        status: err.status,
        error:err,
        message: err.message,
        stack:err.stack
    });
}

const sendProdError = (err,res)=>{
    //only operational errors are sent
    if(err.isOperational){
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    }else{
        console.error(err);

        res.status(500).json({
            err:"Error",
            status:"Something went wrong"
        })
    }
}



module.exports = (err,req,res,next)=>{


    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if(process.env.NODE_ENV==="development"){
        sendDevError(err,res);

    }else if(process.env.NODE_ENV==="production"){
        let error = {...err,name:err.name,code:err.code,errmsg:err.errmsg};
        if(error.name==='CastError') error=castingErrorDb(error);
        if(error.code === 11000) error=handleDuplicateDb(error);

        sendProdError(error,res);
    }

    

    next();
}