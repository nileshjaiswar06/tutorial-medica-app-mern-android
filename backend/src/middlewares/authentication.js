const jwt = require("jsonwebtoken")

function verifyAccessToken(req, res, next) {
    try {
        if(req.headers.authorization == null) {
            throw "invalid access"
        }
        const verifiedData = jwt.verify(req.headers.authorization, process.env.SECRET)
        console.log("verify : ", verifiedData)

        req.userEmail = verifiedData.email 
        req.userRole = verifiedData.role
    } catch (error) {
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