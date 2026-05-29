const mongoose = require("mongoose")

const seniorPlanSchema = new mongoose.Schema({

    company: String,

    preparationJourney: String,

    dsaExperience: String,

    interviewExperience: String,

    projectExperience: String,

    mockExperience: String,

    tips: String,

    createdAt: {
        type: Date,
        default: Date.now
    }

})

module.exports = mongoose.model("SeniorPlan", seniorPlanSchema)