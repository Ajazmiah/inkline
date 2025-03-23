import userModel from "../models/userModel.js";

export const checkEmailVerification = async (req, res, next) => {
    const userId = req.user.id; // Assuming you have user information from authentication middleware

    console.log("__REQ___", req.user)

    try {
        const user = await userModel.findById(userId);
        if (!user.isVerified) {
            return res.status(403).json({ message: `Please verify your email ${user.email} to access this resource.` });
        }
        next();
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};


