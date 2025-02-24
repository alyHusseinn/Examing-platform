import { validationResult, check } from 'express-validator';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};
export const register = [
    check('name').notEmpty().withMessage('Name is required'),
    check('email').isEmail().withMessage('Invalid email'),
    check('role').isIn(['admin', 'student']).withMessage('Invalid role'),
    check('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { name, email, role, password } = req.body;
            const userExists = await User.findOne({ email });
            if (userExists) {
                return res.status(400).json({ message: 'User already exists' });
            }
            const user = await User.create({
                name,
                email,
                role,
                password
            });
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                points: user.points,
                token: generateToken(user._id)
            });
        }
        catch (error) {
            res.status(500).json({ message: 'Server error' });
        }
    }
];
export const login = [
    check('email').isEmail().withMessage('Invalid email'),
    check('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { email, password } = req.body;
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                points: user.points,
                token: generateToken(user._id)
            });
        }
        catch (error) {
            res.status(500).json({ message: 'Server error' });
        }
    }
];
export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            points: user.points,
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
/**
 * Forgot password
 * POST /api/auth/forgot-password
 * @body {string} email - User email
 * 1. Find user by email
 * 2. Generate reset token using JWT to sign it with user id
 * 3. Save the reset token and expiry date to the user
 * 4. Send email to the user with the reset token
 */
// export const forgotPassword = async (req: Request, res: Response) => {
//   try {
//     const { email } = req.body;
//     const user = await User.findOne({ email })
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     const resetToken = generateToken(user._id);
//     user.resetPasswordToken = resetToken;
//     user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
//     await user.save();
//   }
//   catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };
