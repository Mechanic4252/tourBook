const mongoose = require('mongoose');
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true,"user must have a name"]
    },
    email:{
        type: String,
        required: [true,"user must have a email"],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail,"Please provide valid email"]
    },
    photo:{
        type: String
    },

    password:{
        type: String,
        required: [true,"user must have a password"],
        minlength: 8,
        selected:false
    },
    passwordConfirm:{
        type: String,
        required: [true,"please provide a confirmation password"],
        validate:{
            validator: function(el){
                return el===this.password;
            },
            message:"Passwords are not same"
        }
    }
})

userSchema.pre('save',async function(next) {
    if(!this.isModified('password')) return next();

   this.password = await bcrypt.hash(this.password,12);
   this.passwordConfirm=undefined;
   next();

})

userSchema.methods.checkPassword = async (candidatePass,userPass)=>{
    return await bcrypt.compare(candidatePass,userPass);
}

const User = mongoose.model('User',userSchema);

module.exports = User;