const exp=require('express');
const  router=exp.Router();

//for handling synchcronous errors
const expressAsyncHandler=require('express-async-handler')
//to extract  body of request obj
router.use(exp.json());


router.post('/food-data',expressAsyncHandler(async(request,response)=>{

    let food_itemsCollectionObj=request.app.set("food_itemsCollectionObj");
     let foodCategoryCollectionObj=request.app.get("foodCategoryCollectionObj")
    let foodData=await food_itemsCollectionObj.find().toArray();
     let foodCategory=await foodCategoryCollectionObj.find().toArray();
   response.send([foodData,foodCategory])

}))


module.exports=router;