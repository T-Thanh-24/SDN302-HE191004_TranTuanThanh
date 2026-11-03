const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/login', (req, res) => {
    const { email, password } = req.body || {};

    if (
        email !== 'HE191004@fpt.edu.vn' ||
        password !== 'HE191004@123'
    ) {
        return res.status(401).json({
            message: 'Invalid email or password'
        });
    }

    const token = jwt.sign(
        {
            studentId: 'HE191004',
            email: email
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    return res.json({
        message: 'Login successfull',
        token: token
    });
});

module.exports = router;
