import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const register = async (req, res) => {

    try{

    const { name, email, password, location } = req.body;

    if (!name || !email || !password || !location) {
    return res.status(400).send("All fields are required");
    }

    if (!email.includes("@")) {
    return res.status(400).send("Invalid email address");
    }

    if (password.length < 6) {
    return res.status(400).send("Password must be at least 6 characters");
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        return res.status(400).send("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);


    const user = new User({
        name,
        email,
        password: hashedPassword,
        location
    });

    

    await user.save();


    res.send("User registered successfully");

    }catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
};




const login = async (req, res) => {

    try {

        const { email, password } = req.body;

            if (!email || !password) {
            return res.status(400).send("Email and password are required");
            }   


            const user = await User.findOne({ email });

            if (!user) {
                return res.status(401).send("Invalid email or password");
            }
            
            const passwordMatch = await bcrypt.compare(
                password,
                user.password
            );

            if (!passwordMatch) {
                return res.status(401).send("Invalid email or password");
            }


        const token = jwt.sign(
            { 
                userId: user._id,
                role: user.role
            },

            process.env.JWT_SECRET,

            { expiresIn: "10d" }
        );

        res.json({
            message: "Login successful",
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }

};

export {
    register,
    login
};
