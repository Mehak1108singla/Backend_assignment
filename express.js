const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Maximum log file size before rotation (1MB)
const MAX_LOG_SIZE = 1 * 1024 * 1024; // 1MB

// Middleware to log request details
app.use((req, res, next) => {
    const logDetails = {
        timestamp: new Date().toISOString(),
        ip: req.ip,
        url: req.originalUrl,
        protocol: req.protocol,
        method: req.method,
        hostname: req.hostname,
        query: req.query,
        headers: req.headers,
        userAgent: req.get('User-Agent')
    };

    // Check file size and rotate if necessary
    fs.stat('requests.log', (err, stats) => {
        if (err) {
            console.error('Error checking file size', err);
        } else if (stats.size > MAX_LOG_SIZE) {
            const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
            fs.rename('requests.log', `requests_${timestamp}.log`, (err) => {
                if (err) {
                    console.error('Error rotating log file', err);
                } else {
                    console.log('Log file rotated');
                }
            });
        }
    });

    // Log details to the file
    fs.appendFile('requests.log', JSON.stringify(logDetails) + '\n', (err) => {
        if (err) {
            console.error('Error writing to log file', err);
        }
    });

    // Log details to console (optional)
    console.log(logDetails);

    next(); // Pass control to the next middleware
});

// Basic route for testing
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
