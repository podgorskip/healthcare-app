require('dotenv').config();
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
const patientRoutes = require('./routes/patientRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const cartRoutes = require('./routes/cartRoutes');
const visitRoutes = require('./routes/visitRoutes');
const userRoutes = require('./routes/userRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

app.use('/api/users', userRoutes.router); 
app.use('/api/doctors', doctorRoutes.router); 
app.use('/api/patients', patientRoutes.router); 
app.use('/api/cart', cartRoutes.router);
app.use('/api/visits', visitRoutes.router);
app.use('/api/auth', authRoutes.router);
app.use('/api/reviews', reviewRoutes.router);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});