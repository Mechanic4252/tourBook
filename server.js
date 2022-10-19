const mongoose = require('mongoose');
const app = require("./app");
const dotenv = require('dotenv');

dotenv.config({path: './config.env'});


mongoose.connect(process.env.DATABASE,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify: true
}).then(()=>{
    console.log("connection successful");
});



const port = process.env.PORT || 3030;
 
app.listen(port,()=>{
    console.log(`App listening on port ${port}...`);
})