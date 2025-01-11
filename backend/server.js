require('dotenv').config('./.env');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000, 
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

const authRoutes = require('./routes/authenticationRoutes');
const userRoutes = require('./routes/userRoutes');
const scheduledVisitRoutes = require('./routes/scheduledVisitRoutes');
const availabilityRoutes = require('./routes/availabilityRoutes');

app.use('/api/users', userRoutes.router); 
app.use('/api/scheduled', scheduledVisitRoutes.router); 
app.use('/api/availability', availabilityRoutes.router);
app.use('/api/auth', authRoutes.router);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});