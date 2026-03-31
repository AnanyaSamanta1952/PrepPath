const express = require("express")
const router = express.Router()

const SeniorPlan = require("../models/SeniorPlan")

// AI Comparison API
router.post("/analyze", async (req, res) => {
    try {

        const { dsa, projects, mock } = req.body

        // Get all senior plans
        const seniors = await SeniorPlan.find()

        if (seniors.length === 0) {
            return res.json({ message: "No senior data available" })
        }

        // Calculate averages
        let totalDSA = 0
        let totalProjects = 0
        let totalMock = 0

        seniors.forEach(s => {
            totalDSA += s.dsa_problems || 0
            totalProjects += s.projects || 0
            totalMock += s.mock_interviews || 0
        })

        const count = seniors.length

        const avgDSA = totalDSA / count
        const avgProjects = totalProjects / count
        const avgMock = totalMock / count

        console.log("AVG VALUES:", {
            avgDSA,
            avgProjects,
            avgMock,
        })

        if (avgDSA === 0 || avgProjects === 0 || avgMock === 0) {
            return res.json({
                message: "Not enough valid senior data"
            })
        }

        // Calculate score
        const safeDivide = (a, b) => (b === 0 ? 0 : a / b)

        const score = (
            safeDivide(dsa, avgDSA) +
            safeDivide(projects, avgProjects) +
            safeDivide(mock, avgMock) 
        ) / 3 * 100

        // Suggestions
        let suggestions = []

        if (dsa < avgDSA) suggestions.push("Increase DSA practice")
        if (projects < avgProjects) suggestions.push("Build more projects")
        if (mock < avgMock) suggestions.push("Start mock interviews")

        res.json({
            score: Math.round(score),
            suggestions
        })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

module.exports = router