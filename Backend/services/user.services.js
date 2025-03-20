// used to create user 

const userModel=require('../models/model.user');


module.exports.createUser = async ({
firstname,lastname,email,password})=>{
    if(!firstname || !email || ! password){
        //if any of three missing don't create user
        throw new Error("All fields are requried");
    }
    // else create user 
    const user = userModel.create({
        fullname:{
            firstname,
            lastname
        },
        email,
        password
    });
    // hash the password before accessing 
    return user; 
}