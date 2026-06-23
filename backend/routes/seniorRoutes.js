const express = require("express")
const router = express.Router()
const authMiddleware = require("../middleware/authMiddleware")
const SeniorPlan = require("../models/SeniorPlan")

// POST - Add Senior Plan
router.post("/senior-plan", authMiddleware, async (req, res) => {
    try {
        console.log("BODY RECEIVED:", req.body)
        const newPlan = new SeniorPlan({ ...req.body, user: req.user.id })
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
            .populate("user", "_id")

        res.json(plans)

    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
})


// DELETE - Delete one senior plan by ID
router.delete("/senior-plan/:id", authMiddleware, async (req, res) => {
    try {

        const plan = await SeniorPlan.findById(req.params.id)

        if (!plan) {
            return res.status(404).json({
                message: "Experience not found"
            })
        }

        if (plan.user.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You can delete only your own experience"
            })
        }

        await SeniorPlan.findByIdAndDelete(req.params.id)

        res.json({
            message: "Deleted successfully"
        })

    } catch (error) {
        res.status(500).json({
            error: error.message
        })
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

// UPDATE - Edit senior plan
router.put("/senior-plan/:id", authMiddleware, async (req, res) => {
    try {

        const plan = await SeniorPlan.findById(req.params.id)

        if (!plan) {
            return res.status(404).json({
                message: "Experience not found"
            })
        }

        if (plan.user.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You can edit only your own experience"
            })
        }

        const updated = await SeniorPlan.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )

        res.json(updated)

    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
})

module.exports = router