const express = require('express')
require('dotenv').config()
const connectDB =require('./config/database')
const authRoute = require('./Routes/authRoutes')

const app = express()
const cors = require('cors');

app.use(cors());

app.use(express.json())

app.get("/", (req, res) => {
  res.send("Recipe App Backend is running 🚀");
});


app.use('/auth' , authRoute )



app.listen(process.env.PORT , ()=>{
    console.log(`server is start onn PORT ${process.env.PORT}`)
    connectDB()
})

