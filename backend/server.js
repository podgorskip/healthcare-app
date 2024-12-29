require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

const userRoutes = require('./routes/userRoutes');
const scheduledVisitRoutes = require('./routes/scheduledVisitRoutes');
const availabilityRoutes = require('./routes/availabilityRoutes');

app.use('/api/users', userRoutes.router); 
app.use('/api/scheduled', scheduledVisitRoutes.router); 
app.use('/api/availability', availabilityRoutes.router);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});