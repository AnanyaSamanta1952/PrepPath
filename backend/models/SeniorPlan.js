//Stores successful preparation
const mongoose=require("mongoose")

const seniorPlanSchema=new mongoose.Schema({
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    company: String,
    months_of_preparation:Number,
    dsa_problems:Number,
    projects: Number, 
    mock_interviews:Number,
    daily_hours:Number,
    subjects:[String],
    tips:String
})

module.exports=mongoose.model("SeniorPlan",seniorPlanSchema)