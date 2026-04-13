const express = require("express")
const router = express.Router()
const axios = require("axios")

const SeniorPlan = require("../models/SeniorPlan")

// AI ML API
router.post("/analyze", async (req, res) => {
    try {
        const { dsa, projects, mock, internships, hackathons } = req.body
        // 🔥 Call Python ML API
        const response = await axios.post("http://127.0.0.1:5001/predict", {
            dsa,
            projects,
            mock,
            internships: internships || 0,
            hackathons: hackathons || 0
        })

        const { prediction, probability } = response.data

        // Suggestions (keep this logic)
        let suggestions = []

        if (dsa < 300) suggestions.push("Increase DSA practice")
        if (projects < 2) suggestions.push("Build more projects")
        if (mock < 5) suggestions.push("Start mock interviews")
        if (internships < 1) suggestions.push("Try to get internship")
        if (hackathons < 1) suggestions.push("Participate in hackathons")

        res.json({
            score: Math.round(probability * 100),
            prediction: prediction === 1 && probability > 0.6
                ? "Likely to be placed"
                : "Needs improvement",
            suggestions
        })

    } catch (error) {
        console.log("🔥 FULL ERROR:", error)

        if (error.response) {
            console.log("FLASK ERROR DATA:", error.response.data)
            console.log("STATUS:", error.response.status)
        } else if (error.request) {
            console.log("NO RESPONSE FROM FLASK")
        } else {
            console.log("AXIOS SETUP ERROR:", error.message)
        }

        res.status(500).json({ error: "ML server error", details: error.message })
    }
})

module.exports = router