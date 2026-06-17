require("dotenv").config()

const express = require("express")
const cors = require("cors")
const connectDB=require('./config/db')
const seniorRoutes = require("./routes/seniorRoutes")
const fresherRoutes = require("./routes/fresherRoutes")
const analysisRoutes = require("./routes/analysisRoutes")
const authRoutes = require("./routes/authRoutes")

const app=express();

connectDB()

app.use(cors())
app.use(express.json())
app.use("/api/auth", authRoutes)
app.use("/api", seniorRoutes)
app.use("/api", fresherRoutes)
app.use("/api", analysisRoutes)

app.get('/',(req,res)=>{
    res.send("PrepPath backend running")
})


app.listen(5000,()=>{
    console.log("Server running on port 5000")
})