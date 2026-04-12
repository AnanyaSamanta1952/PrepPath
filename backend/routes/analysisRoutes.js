const express = require("express")
const router = express.Router()
const axios = require("axios")

const SeniorPlan = require("../models/SeniorPlan")

// AI ML API
router.post("/analyze", async (req, res) => {
    try {

        const { dsa, projects, mock, internships, hackathons } = req.body

        // 🔥 Call Python ML API
        const response = await axios.post("http://localhost:5001/predict", {
            dsa,
            projects,
            mock,
            internships,
            hackathons,
            hours: 0
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
            prediction: prediction === 1
                ? "Likely to be placed"
                : "Needs improvement",
            suggestions
        })

    } catch (error) {
        console.log("ERROR:", error.message)
        res.status(500).json({ error: "ML server error" })
    }
})

module.exports = router