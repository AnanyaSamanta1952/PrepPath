const express = require("express")
const router = express.Router()
const axios = require("axios")
const fs = require("fs")
const path = require("path")

const SeniorPlan = require("../models/SeniorPlan")

const datasetStats = JSON.parse(
    fs.readFileSync(
        path.join(__dirname, "../../ml-model/dataset_stats.json"),
        "utf-8"
    )
)

// AI ML API
router.post("/analyze", async (req, res) => {
    try {
        const { dsa, projects, mock, internships, hackathons } = req.body
        const seniors = await SeniorPlan.find()

        const totalSeniors = seniors.length

        const avgDSA =
            seniors.reduce((sum, s) => sum + (s.dsa_problems || 0), 0) / totalSeniors

        const avgProjects =
            seniors.reduce((sum, s) => sum + (s.projects || 0), 0) / totalSeniors

        const avgMocks =
            seniors.reduce((sum, s) => sum + (s.mock_interviews || 0), 0) / totalSeniors

        const avgInternships =
            seniors.reduce((sum, s) => sum + (s.internships || 0), 0) / totalSeniors

        const avgHackathons =
            seniors.reduce((sum, s) => sum + (s.hackathons || 0), 0) / totalSeniors

        const similarSeniors = seniors
            .map((s) => {

                const difference =
                    Math.abs((s.dsa_problems || 0) - dsa) +
                    Math.abs((s.projects || 0) - projects) +
                    Math.abs((s.mock_interviews || 0) - mock) +
                    Math.abs((s.internships || 0) - internships) +
                    Math.abs((s.hackathons || 0) - hackathons)

                return {
                    company: s.company,
                    difference,
                    tips: s.tips
                }
            })
            .sort((a, b) => a.difference - b.difference)
            .slice(0, 3)

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

        // =======================
        // Senior Comparison
        // =======================

        if (dsa < avgDSA) {
            suggestions.push(
                `Your DSA preparation is below the average placed senior (${Math.round(avgDSA)} solved problems).`
            )
        }

        if (projects < avgProjects) {
            suggestions.push(
                `Most placed seniors had around ${Math.round(avgProjects)} projects.`
            )
        }

        if (mock < avgMocks) {
            suggestions.push(
                "Your mock interview practice is lower than successful senior candidates."
            )
        }

        if (internships < avgInternships) {
            suggestions.push(
                "Internship experience is lower compared to placed seniors."
            )
        }

        if (hackathons < avgHackathons) {
            suggestions.push(
                "Hackathon participation is lower than most placed senior profiles."
            )
        }

        // =======================
        // Similar Senior Profiles
        // =======================

        if (similarSeniors.length > 0) {

            suggestions.push(
                `Your profile is currently closest to seniors placed at ${similarSeniors
                    .map(s => s.company)
                    .join(", ")}.`
            )

            suggestions.push(
                `Advice from similar seniors: "${similarSeniors[0].tips}"`
            )
        }

        // =======================
        // Dataset Trend Analysis
        // =======================

        if (dsa < datasetStats.placed_avg_dsa) {

            suggestions.push(
                `Average placed candidates in the training dataset solved around ${Math.round(datasetStats.placed_avg_dsa)} DSA problems.`
            )
        }

        if (projects < datasetStats.placed_avg_projects) {

            suggestions.push(
                `Placed students usually had ${Math.round(datasetStats.placed_avg_projects)} projects in their resumes.`
            )
        }

        if (mock < datasetStats.placed_avg_mock) {

            suggestions.push(
                `Mock interview performance is below the dataset average of placed students.`
            )
        }

        if (internships === 0) {

            suggestions.push(
                `Students with internships had a ${Math.round(datasetStats.internship_success_rate * 100)}% placement success rate in the dataset.`
            )
        }

        if (hackathons === 0) {

            suggestions.push(
                `Students participating in hackathons showed better placement performance in the dataset.`
            )
        }

        res.json({
            score: Math.round(probability * 100),
            prediction: prediction === 1 && probability > 0.6
                ? "Likely to be placed"
                : "Needs improvement",
            level:
                probability > 0.8 ? "High" :
                    probability > 0.5 ? "Medium" : "Low",
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