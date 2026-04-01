const express = require("express")
const router = express.Router()

const SeniorPlan = require("../models/SeniorPlan")

// POST - Add Senior Plan
router.post("/senior-plan", async (req, res) => {
    try {
        console.log("BODY RECEIVED:", req.body)

        const newPlan = new SeniorPlan(req.body)
        await newPlan.save()
        res.json({ message: "Senior plan added successfully" })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// GET - Get all Senior Plans
router.get("/senior-plans", async (req, res) => {
    try {
        const plans = await SeniorPlan.find()
        res.json(plans)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// DELETE - Delete one senior plan by ID
router.delete("/senior-plan/:id", async (req, res) => {
    try {
        await SeniorPlan.findByIdAndDelete(req.params.id)
        res.json({ message: "Deleted successfully" })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// DELETE - Clear all senior data (temporary)
router.delete("/clear-seniors", async (req, res) => {
    try {
        await SeniorPlan.deleteMany({})
        res.json({ message: "All senior data deleted" })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

module.exports = router