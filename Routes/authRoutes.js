const express = require('express')
// const bcrypt = require('bcrypt')
const bcrypt = require("bcryptjs")

const jwt = require('jsonwebtoken')
const User = require('../model/auth.model');
const authRoute = express.Router();

const JWT_SECRET = 'Recipe_secret_key';



async function FetchData(url){
try {
    let res = await fetch(url);
    let data = res.json();
    return data;
} catch (error) {
    console.log("get error:", error)
}
}

// to get all data
authRoute.get('/Data', async (req, res) => {
    try {
        // https://api.spoonacular.com/recipes/complexSearch?apiKey=cb5d029c3c6d46299673a01ce467f5fc&number=50

        const recipe_data = "https://dummyjson.com/recipes"
        const data = await FetchData(recipe_data)
         res.json(data)
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Something Went wrong"});
    }
})

// to get all users
authRoute.get('/users', async (req, res) => {
    try { 
        const users = await User.find({})
         res.json(users)
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Something Went wrong"});
    }
})



// Register route
// authRoute.post('/register', async (req, res) => {
//     try {
//         const { Username, email, password } = req.body;
//         // console.log("red")
//         const hashPassword = await bcrypt.hash(password, 10);
        
//         const newUser = await User.create({ 
//             Username,
//             email,
//             password: hashPassword,
//         });
//         await newUser.save()
        

//         res.status(201).json({ message: 'User registered successfully' })
//     } catch (error) {
//         console.error('Registration error:', error);
//         res.status(500).json({ error: 'Failed to register' });
//     }
// });
authRoute.post('/register', async (req, res) => {
  try {
    const { Username, email, password } = req.body;

    if (!Username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    await User.create({
      Username,
      email,
      password: hashPassword
    });

    res.status(201).json({ message: "User registered successfully ✅" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});


// Login route
authRoute.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid password' });
        }


        const token = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: '1h' }
        );


        res.status(200).json({
            message: 'User logged in successfully',
            token,
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Failed to login' });
    }
});

module.exports = authRoute
