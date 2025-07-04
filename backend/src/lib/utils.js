import jwt from 'jsonwebtoken';

export const generateToken = (userId, res) => {
    const token =jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });

    res.cookie('jwt',token, {
        maxage: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        sameSite: 'strict', // Prevent CSRF attacks
    });

    return token;
}