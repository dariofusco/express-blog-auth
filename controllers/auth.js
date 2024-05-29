const users = require('../db/users.json');
const auth = require("../middlewares/auth.js");

const login = (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if(!user){
        return res.status(404).send('Credenziali errate.');
    }
    const token = auth.generateToken(user);
    res.send(token);
}

module.exports = {
    login
}