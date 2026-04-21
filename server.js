require('dotenv').config()
const express = require('express')
const connectDB = require('./config/db')
const authRoutes = require("./routes/authRoutes");

const app = express()

app.use(express.json())

connectDB()

app.use("/api/auth", authRoutes);

app.get('/',(req,res)=>{
    res.send('app is run')
})

let PORT = process.env.PORT || 5000

app.listen(PORT,()=>{
    console.log(`server is running in ${PORT}`)
})