const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const app = express();
const port = process.env.PORT || 3000;

// Security Middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "cdnjs.cloudflare.com", "cdn.jsdelivr.net"],
            styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com", "cdnjs.cloudflare.com"],
            fontSrc: ["'self'", "fonts.gstatic.com", "cdnjs.cloudflare.com"],
            imgSrc: ["'self'", "data:", "images.unsplash.com"],
            connectSrc: ["'self'"]
        }
    }
}));
app.use(cors());

// Basic Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the Frontend directory
app.use(express.static(path.join(__dirname, 'Frontend')));

// Handle all routes by serving index.html
app.get('*', (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'Frontend', 'index.html'));
    } catch (error) {
        console.error('Error serving index.html:', error);
        res.status(500).send('Error loading page');
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err.stack);
    res.status(500).send('Something went wrong! Please try again later.');
});

// Handle 404 errors
app.use((req, res) => {
    res.status(404).send('Page not found');
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`Visit http://localhost:${port} to view the application`);
}); 