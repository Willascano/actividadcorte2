const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) return res.status(401).send('Access denied. No token provided.');

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (ex) {
        console.log('Token verification failed:', ex.message);
        res.status(400).send('Invalid token.');
    }
};

module.exports = auth;
