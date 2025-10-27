const express = require('express');
const cors = require('cors');
const path = require('path');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const loadRoutes = require('./routes/loads');
const messageRoutes = require('./routes/messages');
const adminRoutes = require('./routes/admin');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/loads', loadRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/admin', adminRoutes);

// Serve static files from the React app (if you're using React)
// app.use(express.static(path.join(__dirname, 'client/build')));

// The "catchall" handler: for any request that doesn't match an API route
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
// });

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
