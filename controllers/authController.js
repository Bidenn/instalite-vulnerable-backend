const User = require('../models/User');
const { Client } = require('pg');

const register = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                error: 'Password does not meet the required criteria.',
            });
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email is already registered' });
        }

        const user = await User.create({
            email: email,
            password: password,
        });

        res.status(200).json({ message: 'Registration Success' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: 'Failed to register' });
    }
};

const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER, 
    password: process.env.DB_PASSWORD,
});

client.connect();

const login = async (req, res) => {
    const { UsernameOrEmail, Password } = req.body;

    try {
        const query = `SELECT * FROM "Users" WHERE username = '${UsernameOrEmail}' OR email = '${UsernameOrEmail}' AND password = '${Password}'`;

        const result = await client.query(query);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
         
        const user = result.rows[0];
        const returned = user.username ? user.username : user.id;

        res.status(200).json({ message: 'Login successful', loggedUser: returned });    
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'An error occurred during login' });
    }
};

const logout = async (req, res) => {
    try {
        const loggedUser = req.username;
        const user = await User.findOne(loggedUser);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.sessionId = null;
        await user.save();

        res.json({
            message: 'Logout successful',
        });
    } catch (error) {
        console.error('Error during logout:', error);
        res.status(500).json({ error: 'Failed to logout' });
    }

};

module.exports = { register, login, logout };