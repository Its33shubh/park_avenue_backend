require('dotenv').config()
const express = require('express')
const cors = require('cors') 
const connectDB = require('./config/db')
const authRoutes = require("./routes/authRoutes")
const adminRoutes = require("./routes/adminRoutes")
const categoryRoutes = require("./routes/categoryRoutes")
const productRoutes = require("./routes/productRoutes")
const orderRoutes = require("./routes/orderRoutes")
const tableRoutes = require("./routes/tableRoutes")
const reportRoutes = require("./routes/reportRoutes")

const app = express()
app.use(cors())

app.use(express.json())

connectDB()

app.use("/api/auth", authRoutes)
app.use("/api/admin",adminRoutes)
app.use("/api/category", categoryRoutes)
app.use("/api/product", productRoutes)
app.use("/api/order",orderRoutes)
app.use("/api/table", tableRoutes)
app.use("/api/report",reportRoutes)

app.get('/',(req,res)=>{
    res.send('app is run')
})

let PORT = process.env.PORT || 5000

app.listen(PORT,()=>{
    console.log(`server is running in ${PORT}`)
})