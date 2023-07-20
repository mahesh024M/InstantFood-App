const express=require('express')
const router=express.Router()
const Order=require('../models/Orders')

router.use(express.json());
router.post('/orderData', async (req, res) => {
    let data = req.body.order_data
    await data.splice(0,0,{Order_date:req.body.order_date})
   // console.log("1231242343242354",req.body.email)
  let newOrder=req.body;
    //if email not exisitng in db then create: else: InsertMany()
    let ordersCollectionObj = req.app.get("ordersCollectionObj");
    let eId = await ordersCollectionObj.findOne({ 'email': req.body.email })
    console.log(eId)
    if (eId===null) {
        try {
            console.log(data)
           // console.log("1231242343242354",req.body.email)
            // await Order.create({
            //     email: req.body.email,
            //     order_data:[data]
            // }).then(() => {
            //     res.json({ success: true })
            // })
             await ordersCollectionObj.insertOne(newOrder);
            res.json({ success: true })
        } catch (error) {
            console.log(error.message)
            res.send("Server Error", error.message)

        }
    }

    else {
        try {
            await ordersCollectionObj.findOneAndUpdate({email:req.body.email},
                { $push:{order_data: data} }).then(() => {
                    res.json({ success: true })
                })
        } catch (error) {
            console.log(error.message)
            res.send("Server Error", error.message)
        }
    }
})


router.post('/myorderData',async(req,res)=>{
    try{
        let ordersCollectionObj = req.app.get("ordersCollectionObj");
        let myData=await ordersCollectionObj.findOne({'email':req.body.email})
        res.json({orderData:myData})
    }
    catch(error){
         res.send("Server error",error.message);
    }
})

module.exports=router