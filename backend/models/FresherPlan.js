//Stores current preparation
const mongoose = require("mongoose")

const fresherPlanSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    dsa_per_day: Number,
    projects: Number,
    mock_interviews: Number,
    study_hours: Number,
    subjects_learning: [String],
    prep_months: Number
})

module.exports = mongoose.model("FresherPlan", fresherPlanSchema)