const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');
const connectToMongo=require('../db')

const JWT_SECRET = 'Sidisagoodboy';
// ROUTE 1: create a user using: POST "/api/auth/createuser". Doesn't require Auth
router.post('/createuser', [
  body('email', 'Enter a valid email').isEmail(),
  body('name', 'Enter a valid name').isLength({ min: 3 }),
  body('password', 'Password must be atleast 5 characters').isLength({ min: 5 })
], async (req, res) => {
  connectToMongo();
  let success = false;
  // if there are errors return bad request and error
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({success, errors: errors.array() });
  }

  // check whether user with this email exists already
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({success, error: "Sorry ! a user with same email exists already" })
    }
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt)

    //create a new user
    user = new User({
      name: req.body.name,
      email: req.body.email,
      password: secPass,
    })
await user.save();
    const data = {        //payload
      user: {
        id: user.id
      }
        
    }
    const authtoken = jwt.sign(data, JWT_SECRET);
    success = true;
    res.json({ success, authtoken })

    // catch errors   
  } catch (error) {
    console.error(error.message);
    res.status(500).send("some error occured");
  }
})


   
// ROUTE 2: Authenticate a user using: POST "/api/auth/login". No login required
router.post('/login', [
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password cannot be blank').exists(),
], async (req, res) => {
  // let success = false;

  // if there are errors return bad request and error
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {email, password} = req.body;  // destructuring  (getting email and pswd from req.body)

  try { 
    let user = await User.findOne({email});
    if (!user) {
      return res.status(400).json({error: "Please login with correct credentials"})
    }

    const passwordCompare = await bcrypt.compare(password, user.password); // it matches hashes internally 
    if (!passwordCompare) {
      return res.status(400).json({success, error: "Please login with correct credentials"})
    }
    const data = {        //payload
      user:{
        id: user.id
      }
    }
    const authtoken = jwt.sign(data, JWT_SECRET);
    success = true
    res.json({ success, authtoken }) 
     
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
  
})

// ROUTE 3: Get loggedin user details using: POST "/api/auth/getuser". Login required
router.post('/getuser', fetchuser, async(req, res)=>{
  try {
    userId = req.user.id;  // fetching user id from fetchuser.js that is appended
    const user = await User.findById(userId).select("-password")
    res.send(user)
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server error");
  }
})

module.exports = router       