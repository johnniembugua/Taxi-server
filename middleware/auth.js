const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const auth = async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: "No auth token, access denied" });

    }
    const myToken = req.headers.authorization.split(' ')[1];
    try {

        const verified = jwt.verify(myToken, process.env.JWT_SECRET);
        if (!verified)
            return res
                .status(401)
                .json({ message: "Token verification failed, authorization denied" });
        const user = await User.findById(verified.id);
        req.user = user.toJSON();
        next();

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = auth;