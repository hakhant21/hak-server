const path = require('path');
const express = require('express');
const cors = require('cors');
const colors = require('colors');
const dotenv = require('dotenv').config();

const { errorHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./config/database');

const PORT = process.env.PORT || 5000;

// Connecting to database
connectDB();
// Express initilize
const app = express();
// Express Json middleware
app.use(express.json());
// Express url encoded extendted
app.use(express.urlencoded({ extended: true }));

// Image Static Public Folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Express cors middleware
app.use(cors());
// Posts Route
app.use('/api/posts', require('./routes/postRoutes'));
// Users Route`
app.use('/api/users', require('./routes/userRoutes'));
// Image Upload Route
app.use('/api/uploads', require('./routes/uploadRoutes'));
// Api server index route
app.get('/', (req, res) => {
  res.send('Server is running smoothly...');
});
// Error Handler Middleware
app.use(errorHandler);
// Listen on port 5000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
