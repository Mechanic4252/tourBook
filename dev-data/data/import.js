const mongoose = require('mongoose');
const fs = require('fs')
const dotenv = require('dotenv');
const Tour = require("./../../models/tourModel");


dotenv.config({path: "./../../config.env"});


mongoose.connect(process.env.DATABASE,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify: true
}).then(()=>{
    console.log("connection successful");
});

//read JSON file

const tours = JSON.parse(fs.readFileSync('./tours-simple.json','utf-8'));

const import_data = async () =>{
    try{
        await Tour.create(tours);
        console.log("Data successfully loaded");
        process.exit(); 
    }catch (err){
        console.log(err);
    }
}

const Delete = async () =>{
    try{
        await Tour.deleteMany()
        console.log("Data successfully deleted");
        process.exit()
    }catch (err){
        console.log(err);
    }
}

if(process.argv[2] === '--import'){
    console.log("import started...");
    import_data();
    
}
if(process.argv[2] === '--delete'){
    console.log("Deletion started...");
    Delete();
}

console.log(process.argv);
//Delete();
//import_data();
