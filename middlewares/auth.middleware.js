const jwt = require("jsonwebtoken");

const isAuthenticated = (req, res, next) => {
    try{
        const { authorization } = req.headers;
        if (!authorization) {
            return res.status(401).json({error: "unauthorized"});
        }
        const token = authorization.split(" ")[1];
        const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET_KEY);
        console.log(payload);
        req.payload = payload;
        // console.log(req.headers);
        return next();
    } catch (error) {
        return res.status(401).json(error.message);
    }
}

const isAdmin = (req, res, next) => {
    try {
        const { userRole } = req.payload;
        console.log(req.payload);
        console.log(userRole);
        if ( userRole !== "admin") {
            return res.status(403).json("Access denied");
        }
        return next();
    } catch (error) {
        return res.status(401).json({error: error.message});
    }
}

module.exports = {
    isAuthenticated,
    isAdmin
}