const exp = require("express");
const userApp = exp.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
//to create token
const jwt=require('jsonwebtoken');

const jwtSecret="Mynamnfkjiunfnjkn778";

//for handling synchcronous errors
const expressAsyncHandler = require("express-async-handler");
//to extract  body of request obj
userApp.use(exp.json());

const { body, validationResult } = require("express-validator");

userApp.post(
  "/create-user",
  // email must be an valid
  body("email").isEmail(),
  // password must be at least 5 chars long
  body("password").isLength({ min: 5 }),

  expressAsyncHandler(async (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }

    let newUserobj = request.body;

    let userCollectionObj = request.app.get("userCollectionObj");
    
    const salt=await bcrypt.genSalt(10);
    let securePassword=await bcrypt.hash(newUserobj.password,salt);

    const newuser = new User({
      name: newUserobj.name,
      password: securePassword,
      email: newUserobj.email,
      location: newUserobj.location,
    });

    // newuser.save();

   await userCollectionObj.insertOne(newuser);
    response.json({ success: true });
  })
);


userApp.post(
  "/login",
  // email must be an valid
  body("email").isEmail(),
  

  expressAsyncHandler(async (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: "Try using correct credentials" });
    }

    let newUserobj = request.body

    let userCollectionObj = request.app.get("userCollectionObj")

   
    let userDb=await userCollectionObj.findOne({email:newUserobj.email});

    if(!userDb){
      return response.status(400).json({ errors: "User not found" });
    }
    else{

      //checking the password
      let result=bcrypt.compare(newUserobj.password,userDb.password)
       if(result===false){
        return response.status(400).json({ errors: "password does not match" });
       }
       else{
        //generate jwt token
        const data={
           user:{
            id:newUserobj.id
           }
        }
        const authToken=jwt.sign(data,jwtSecret);
        return response.json({ success: true,authToken:authToken})
       }


    }
    
  })
);



module.exports = userApp;
