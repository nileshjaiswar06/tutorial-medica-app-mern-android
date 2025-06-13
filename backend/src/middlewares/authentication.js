const jwt = require("jsonwebtoken")

// Import the token blacklist from auth.js
const { tokenBlacklist } = require("../routes/auth")

function verifyAccessToken(req, res, next) {
    try {
        console.log('Backend - Auth Header:', req.headers.authorization);
        
        if(req.headers.authorization == null) {
            throw "invalid access"
        }

        // Remove 'Bearer ' prefix if it exists
        const token = req.headers.authorization.replace('Bearer ', '');
        console.log('Backend - Token after Bearer removal:', token);
        
        if (tokenBlacklist.has(token)) {
            throw "token has been invalidated"
        }
        
        const verifiedData = jwt.verify(token, process.env.SECRET)
        console.log("Backend - Verified data:", verifiedData)

        req.userEmail = verifiedData.email 
        req.userRole = verifiedData.role
    } catch (error) {
        console.log('Backend - Auth Error:', error);
        return res.status(403).json({
            message: "authentication failed",
            error: "invalid access",
            data: null
         })
    }
    next()
}

function checkIsPatient(req, res, next) {
    try {
        if(req.userRole != "patient") {
            throw "only patient can create appointment"
        }
    } catch (error) {
        return res.status(422).json({
            message: "unauthorized access",
            error: error,
            data: null
         })
    }
   next()
}

function checkIsDoctor(req, res, next) {
    try {
        if(req.userRole != "doctor") {
            throw "only doctor can update appointment"
        }
    } catch (error) {
        return res.status(422).json({
            message: "unauthorized access",
            error: error,
            data: null
         })
    }
   next()
}

module.exports = {
    verifyAccessToken,
    checkIsPatient,
    checkIsDoctor
}