import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token
        if (!token) {
            return res.status(401).json({success: false, message: "Unauthorized - no token"})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = await User.findById(decoded.id);
        next();
    }catch(error) {
        return res.status(401).json({success: false, message: "Unauthorized - invalid token"})
    }
}
export default authMiddleware;
