export const checkRole = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        next();
    };
};
export const checkAdmin = checkRole(['admin']);
export const checkStudent = checkRole(['student']);
export const checkAll = checkRole(['admin', 'student']);
