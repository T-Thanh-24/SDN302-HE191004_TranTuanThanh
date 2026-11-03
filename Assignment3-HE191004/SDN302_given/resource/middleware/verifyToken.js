const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    const authorization = req.headers.authorization;

    if (!authorization || !/^Bearer\s+\S+$/.test(authorization)) {
        return res.status(401).json({
            message: 'Unauthorized'
        });
    }

    const token = authorization.split(/\s+/)[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Invalid or expired token'
        });
    }
}

module.exports = verifyToken;
