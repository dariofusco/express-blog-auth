const jwt = require("jsonwebtoken");
require("dotenv").config();

// Creo funzione che genera il token
const generateToken = user => jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1m" });


const authenticateWithJwt = (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).send('Hai bisogno di autenticarti.');
    }

    const token = authorization.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).send(err);
        }
        req.user = user;
        next();
    });
}

module.exports = {
    generateToken,
    authenticateWithJwt,
}