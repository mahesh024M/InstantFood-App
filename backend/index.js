//create express app
const exp=require('express');
const app=exp();  //app->express obj    // exp->module
const mclient=require('mongodb').MongoClient;
const port=5000;



mclient.connect(DBurl)
.then((client)=>{
      //get database
     let dbObj=client.db("InstantFood");
     //create collections
     let food_itemsCollectionObj=dbObj.collection("food_items");
     let foodCategoryCollectionObj=dbObj.collection("foodCategory");
     let userCollectionObj=dbObj.collection("users");
     let ordersCollectionObj=dbObj.collection("orders");
     //sharing collection objects to apis
     app.set("food_itemsCollectionObj", food_itemsCollectionObj);
     app.set("foodCategoryCollectionObj",foodCategoryCollectionObj);
     app.set("userCollectionObj",userCollectionObj);
     app.set("ordersCollectionObj",ordersCollectionObj);
    console.log("Database connection is successful");
})
.catch(err=>console.log("Error in the database connection",err));

app.use((req,res,next)=>{
  res.setHeader("Access-Control-Allow-Origin","http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept"
  );
  next();
})

//import apis
const userApp=require('./Apis/createUser');
const food_itemsApi=require('./Apis/food_itemsApi');
app.use('/user',userApp);
app.use('/food',food_itemsApi)
app.use('/order',require('./Apis/orderData'))

//Handling invalid paths
app.use((request,response,next)=>{
  response.send({message:`path ${request.url} is invalid`})
})

//error Handling
app.use((error,request,response,next)=>{
      response.send({message:"Error occured",reason:`${error.message}`})
})



app.listen(port,()=>{
  console.log(`server started listening on ${port}...`);
})