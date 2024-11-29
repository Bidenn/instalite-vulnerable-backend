const User = require('../models/User');
const { Client } = require('pg');

const register = async (req, res) => {
    try {
        const { email, username, password } = req.body;

        if (!password) {
            return res.status(400).json({ error: 'Password is required' });
        }

        // Directly store the password in plaintext (vulnerable)
        const user = await User.create({
            email,
            username,
            password // no hashing, just store plaintext
        });

        res.status(201).json({
            message: 'Registration successful. Please log in to continue.',
            userId: user.id,
            userEmail: user.email,
            // Expose password in response (vulnerable)
            userPassword: user.password
        });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(400).json({ error: 'Failed to register user', details: error.message });
    }
};

// Set up your PostgreSQL connection (adjust according to your DB setup)
const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'instalite_vulnerable',
    user: 'postgres', 
    password: 'admin',
});

client.connect();

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Debugging output
        console.log('Login attempt:', { username, password });

        // Vulnerable: raw SQL query, susceptible to SQL Injection
        const query = `SELECT * FROM "Users" WHERE username = '${username}' AND password = '${password}'`;
        console.log('Running query:', query); // Debugging the query

        const result = await client.query(query);

        // Debugging output to check query results
        console.log('Query result:', result.rows);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = result.rows[0];

        // Expose password in response (vulnerable)
        res.status(200).json({ message: 'Login successful', userId: user.id, userPassword: user.password });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'An error occurred during login' });
    }
};

const logout = async (req, res) => {

    try {
        const userId = req.user.id;
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.sessionId = null;
        await user.save();

        res.json({
            message: 'Logout successful',
            redirectTo: '/login'
        });
    } catch (error) {
        console.error('Error during logout:', error);
        res.status(500).json({ error: 'Failed to logout' });
    }

};

module.exports = { register, login, logout };