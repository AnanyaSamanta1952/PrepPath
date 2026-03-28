const express = require("express")
const cors = require("cors")
const bodyParser=require("body-parser")
const connectDB=require('./config/db')
const seniorRoutes = require("./routes/seniorRoutes")
const fresherRoutes = require("./routes/fresherRoutes")
const analysisRoutes = require("./routes/analysisRoutes")

const app=express();

connectDB()

app.use(cors())
app.use(express.json())
app.use("/api", seniorRoutes)
app.use("/api", fresherRoutes)
app.use("/api", analysisRoutes)

app.get('/',(req,res)=>{
    res.send("PrepPath backend running")
})


app.listen(5000,()=>{
    console.log("Server running on port 5000")
})