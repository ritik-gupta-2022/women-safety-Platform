import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true,
        },
        name:{
            type:String,
            required:true,
        },
        email:{
            type:String,
            required:true,
            unique:true,
        },
        password:{
            type: String,
            required: true,
        },
        phoneNo:{
            type:String,
            required:true,
            match: [/^\d{10}$/, 'Phone number must be exactly 10 digits'],
            minlength: 10,
            maxlength: 10,
        },
        address: {
            type: String,
            required:true,
            default: 'Point',
        },
        isAdmin:{
            type: Boolean,
            default: false,
        },
        emergencyContacts: [],

    }, { timestamps: true })

const User = mongoose.model('User', userSchema);

export default User;