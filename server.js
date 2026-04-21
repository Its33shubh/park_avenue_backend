const express = require('express')

const app = express()

app.use(express.json())

app.get('/',(req,res)=>{
    res.send('app is run')
})

let PORT = process.env.PORT || 5000

app.listen(PORT,()=>{
    console.log(`server is running in ${PORT}`)
})