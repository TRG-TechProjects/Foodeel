// register & login controller functionS
const userModel = require("../models/user.model")
const foodPartnerModel = require("../models/foodpartner.model")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



// register USER controller function
async function registerUser(req, res){
    const{ fullName, email, password} = req.body;

    const isUserAlreadyExists = await userModel.findOne({
        email
    })
    if(isUserAlreadyExists){
        return res.status(400).json({
            message: "User already registered."
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        fullName,
        email,
        password: hashedPassword
    })

    const token = jwt.sign({
        id: user._id,
    }, process.env.JWT_SECRET)

    res.cookie("token", token)
    res.status(201).json({
        message: "User registered successfully",
        user: {
            id: user._id,
            email: user.email,
            fullName: user.fullName
        }
    })

}



// login USER controller function
async function loginUser(req, res){
    const { email, password } = req.body;

    const user = await userModel.findOne({
        email
    })
    if(!user){
        return res.status(400).json({
            message: "Invalid email or password."
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid){
        return res.status(400).json({
            message: "Invalid email or password."
        })
    }

    const token = jwt.sign({
        id: user._id,
    }, process.env.JWT_SECRET)   
    
    res.cookie("token", token)

    res.status(200).json({
        message: "User logged in successfully",
        user: {
            id: user._id,
            email: user.email,
            fullName: user.fullName
        }
    })
}



// logout USER controller function
function logoutUser(req, res){
    res.clearCookie("token");
    res.status(200).json({
        message: "User logged out successfully"
    })
}



// register FOOD PARTNER controller function
async function registerFoodPartner(req, res){
    const{ name, email, password, phone, address, contactName} = req.body;

    const isAccountAlreadyExists = await foodPartnerModel.findOne({
        email
    })
    if(isAccountAlreadyExists){
        return res.status(400).json({
            message: "Food Partner already registered."
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const foodPartner = await foodPartnerModel.create({
        name,
        email,
        password: hashedPassword,
        phone,
        address,
        contactName
    })

    const token = jwt.sign({
        id: foodPartner._id,
    }, process.env.JWT_SECRET)

    res.cookie("token", token)

    res.status(201).json({
        message: "Food Partner registered successfully",
        foodPartner: {
            _id: foodPartner._id,
            email: foodPartner.email,
            name: foodPartner.name,
            address: foodPartner.address,
            contactName: foodPartner.contactName,
            phone: foodPartner.phone
        }
    })
}



// login FOOD PARTNER controller function
async function loginFoodPartner(req, res){
    const { email, password } = req.body;

    const foodPartner = await foodPartnerModel.findOne({
        email
    })

    if(!foodPartner){
        return res.status(400).json({
            message: "Invalid email or password."
        })
    }

    const isPasswordValid = await bcrypt.compare(password, foodPartner.password);
    if(!isPasswordValid){
        return res.status(400).json({
            message: "Invalid email or password."
        })
    }

    const token = jwt.sign({
        id: foodPartner._id,
    }, process.env.JWT_SECRET)

    res.cookie("token", token)

    res.status(200).json({
        message: "Food Partner logged in successfully",
        foodPartner: {
            _id: foodPartner._id,
            email: foodPartner.email,
            name: foodPartner.name
        }
    })
}



// logout FOOD PARTNER controller function
function logoutFoodPartner(req, res){
    res.clearCookie("token");
    res.status(200).json({
        message: "Food Partner logged out successfully"
    });
}



module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    registerFoodPartner,
    loginFoodPartner,
    logoutFoodPartner
}