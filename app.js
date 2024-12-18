const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path'); 
const bodyParser = require('body-parser');
const sequelize = require('./config/sequelize');
const profileRoutes = require('./routes/profileRoutes');
const postRoutes = require('./routes/postRoutes');
const authRoutes = require('./routes/authRoutes');
const homepageRoutes = require('./routes/homepageRoutes');

app.use(bodyParser.json());

const frontendUrl = process.env.FRONTEND_URL;

app.use(cors({
    origin: `${frontendUrl}`,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/post', postRoutes);
app.use('/api/home', homepageRoutes);

app.use(express.static(path.join(__dirname, 'uploads')));

sequelize.authenticate()
    .then(() => console.log('Database authenticated'))
    .catch((error) => console.error('Authentication failed:', error));

sequelize.sync({ force: true })
    .then(() => {
        console.log('Database synced successfully');
    })
    .catch((err) => {
        console.error('Error syncing database:', err);
    });

const port = 5000;

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    console.log(`Frontend URL : ${frontendUrl}`);
});
