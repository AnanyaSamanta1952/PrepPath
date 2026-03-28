const express=require("express")
const router=express.Router()
const FresherPlan=require("../models/FresherPlan")

//POST - Add Fresher Plan
router.post("/fresher-plan",async(requestAnimationFrame,res)=>{
    try{
        const newPlan=new FresherPlan(requestAnimationFrame.body)
        await newPlan.save()
        res.json({message: "Fresher Plan added successfully" })
    }catch(error){
        res.status(500).json({ error:error.message })
    }
})

module.exports=router