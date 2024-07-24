const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")

const User = require('../models/user');

async function register (req, res) {
    try {
        const data = req.body;
        const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS))
        data["password"] = await bcrypt.hash(data.password, salt)
        const result = await User.create(data)
        res.status(201).send(result);
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
};

async function login (req, res) {
    const data = req.body;
    try {
        let user = await User.getOneByUsername(data.username)
        const match = await bcrypt.compare(data.password, user.password)
        if (match){
            const payload = { 
                username: user.username,
                user_id: user.id
            }
            const sendToken = (err, token) => {
                if(err) {
                    throw new Error("Error in generating token")
                }
                console.log("send token hit")
                res.status(200).json({
                    success: true,
                    token: token,
                })
            }
            jwt.sign(payload, process.env.SECRET_TOKEN, { expiresIn: 3600 }, sendToken)
            
        } else {
            throw new Error("User could not be authenticated")
        }

    } catch (err) {
        res.status(401).json({ error: err.message })
    }
}

module.exports = {
    register, login
}                           