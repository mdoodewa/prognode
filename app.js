const express = require('express');
const logger = require('./config/appconfig').logger

// Import routes
const authRoutes = require('./routes/auth.routes')
const appartmentRoutes = require('./routes/appartments.routes');

// Defining constants
const app = express();
const port = process.env.port || 3000;

app.use(express.json());

// Generic end-point handler
app.all('*', (req, res, next) => {
    console.log("Generic endpoint handler!");
    next();
})

// Using routes
app.use('/api', authRoutes);
app.use('/api/appartments', appartmentRoutes);

// Handle all other (not found) endpoints.
app.all('*', (req, res, next) => {
    console.log('Endpoint not found.')

    const errorObject = {
      message: 'Endpoint does not exist!',
      code: 404,
      date: new Date()
    }
    next(errorObject);
});

// Error handler
app.use((error, req, res, next) => {
    logger.error('Error handler: ', error.message.toString());
    res.status(error.code).json(error)
  })

app.listen(port, ()=> console.log("listening on port "+port));

module.exports = app;